import { useMemo } from 'react'

import { XKEY_DAO_ADRESS } from '@/constants/adress'
import { abi as XKeyPairABI } from '@/constants/contracts/XKeyPair.json'
import { useActiveWeb3React } from '@/hooks'
import { useNFTPositionManagerContract, useContract } from '@/hooks/useContract'
import {
  singlePokerMap,
  SinglePokerItem,
  groupPokerMap,
  GroupPokerItem,
  singlePokerRankMap,
  singlePokerSuitMap
} from '@/pokers'
import {
  useSingleCallResult,
  useSingleContractMultipleData,
  Result
} from '@/state/multicall/hooks'
import { or } from '@/utils/or'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { formatUnits } from '@ethersproject/units'

type PositionDetails = {
  nonce: BigNumber
  tokenId: BigNumber
  operator: string
  token0: string
  token1: string
  fee: number
  tickLower: number
  tickUpper: number
  liquidity: BigNumber
  feeGrowthInside0LastX128: BigNumber
  feeGrowthInside1LastX128: BigNumber
  tokensOwed0: BigNumber
  tokensOwed1: BigNumber
}

type PairMapItem = {
  contract: Contract
  input: (string | number | unknown)[]
  method: string
}

export type PositionTokenPair = {
  tokenId: BigNumber
  pokerInfo: SinglePokerItem | GroupPokerItem | undefined
  pairId: string
}

interface usePositionsResults {
  loading: boolean
  pairIds: Array<PositionTokenPair>
}

export function usePairsFromTokenIds(
  tokenIds: BigNumber[] | undefined,
  pairId: string
): Array<PositionTokenPair> {
  const positionManager = useNFTPositionManagerContract()
  const inputs = useMemo(
    () =>
      tokenIds ? tokenIds.map((tokenId) => [BigNumber.from(tokenId)]) : [],
    [tokenIds]
  )
  const pairIdResults = useSingleContractMultipleData(
    positionManager,
    'getPair',
    inputs
  )
  const pokerPropertyResults = useSingleContractMultipleData(
    positionManager,
    'getPokerProperty',
    inputs
  )

  const loading = useMemo(
    () =>
      [...pairIdResults, ...pokerPropertyResults].some(
        ({ loading }) => loading
      ),
    [pairIdResults, pokerPropertyResults]
  )
  const error = useMemo(
    () =>
      [...pairIdResults, ...pokerPropertyResults].some(({ error }) => error),
    [pairIdResults, pokerPropertyResults]
  )

  const pairIds = useMemo(() => {
    if (!loading && !error && tokenIds && tokenIds?.length) {
      return pairIdResults
        .map((call, i) => {
          const tokenId = tokenIds[i]
          const result = call.result as Result
          const propertyResult = pokerPropertyResults[i].result as Result

          const pokerRank = singlePokerRankMap.get(
            propertyResult.rank.toNumber()
          )
          const pockerSuit = singlePokerSuitMap.get(
            propertyResult.suit.toNumber()
          )

          return {
            tokenId,
            tokenIdStr: tokenId.toString(),
            pokerInfo: Object.assign(pokerRank, pockerSuit),
            pokerProperty: result,
            pairId: result.length ? result[0] : ''
          }
        })
        .filter((item) => item.pairId === pairId)
    }

    return []
  }, [loading, error, tokenIds, pairIdResults, pokerPropertyResults])

  return pairIds
}

interface usePositionResults {
  loading: boolean
  position: PositionDetails | undefined
}

export function useUserPokers(
  account: string | null | undefined,
  pairId: string
): usePositionsResults | any {
  const positionManager = useNFTPositionManagerContract()

  const { result: balanceResult, loading: balanceOfLoading } =
    useSingleCallResult(positionManager, 'balanceOf', [account])

  const accountBalance: number | undefined = balanceResult?.[0]?.toNumber()

  const tokenIdsArgs = useMemo(() => {
    if (accountBalance && account) {
      const tokenRequests: Array<unknown> = []
      for (let i = 0; i < accountBalance; i++) {
        tokenRequests.push([account, i])
      }
      return tokenRequests
    }
    return []
  }, [account, accountBalance])

  const tokenIdResults = useSingleContractMultipleData(
    positionManager,
    'tokenOfOwnerByIndex',
    tokenIdsArgs
  )

  const anyLoading: boolean = useMemo(
    () => tokenIdResults.some((callState) => callState.loading),
    [tokenIdResults]
  )

  const tokenIds = useMemo(() => {
    if (account) {
      return tokenIdResults
        .map(({ result }) => result)
        .filter((result): result is Result => !!result)
        .map((result) => BigNumber.from(result[0]))
    }
    return []
  }, [account, tokenIdResults])

  const pairIdResults = usePairsFromTokenIds(tokenIds, pairId)

  return {
    loading: or(balanceOfLoading, anyLoading),
    pokers: pairIdResults
  }
}

export function useNeedApprove() {
  const positionManager = useNFTPositionManagerContract()
  const { account } = useActiveWeb3React()
  const approveResult = useSingleCallResult(
    positionManager,
    'isApprovedForAll',
    [account, XKEY_DAO_ADRESS]
  )
  return !(approveResult.result?.[0] ?? false)
}

export function useLiquidityPower(pairId: string, tokenId: string): any {
  const pairContract = useContract(pairId, XKeyPairABI)
  const tokenIdBnStr = useMemo(
    () => BigNumber.from(tokenId),
    [tokenId]
  ).toString()
  const { result: balanceOfResult } = useSingleCallResult(
    pairContract,
    'balanceOf',
    [tokenIdBnStr]
  )

  return {
    liquidity: Array.isArray(balanceOfResult)
      ? formatUnits(balanceOfResult[0], 18).toString()
      : 0
  }
}
