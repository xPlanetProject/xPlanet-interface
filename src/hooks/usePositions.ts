import { useMemo } from 'react'

import { abi as XKeyPairABI } from '@/constants/contracts/XKeyPair.json'
import { useToken } from '@/hooks/Tokens'
import {
  useNFTPositionManagerContract,
  useContract,
  useXKeyDaoContract,
  useTokenContract
} from '@/hooks/useContract'
import {
  singlePokerMap,
  SinglePokerItem,
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
import { JSBI } from '@xplanet/sdk'

const { BigInt, divide, multiply } = JSBI

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
  pokerInfo: SinglePokerItem | undefined
  pairId: string
}

interface usePositionsResults {
  loading: boolean
  pairIds: Array<PositionTokenPair>
}

function usePairsFromTokenIds(
  tokenIds: BigNumber[] | undefined
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
    if (!loading && !error && tokenIds) {
      return pairIdResults.map((call, i) => {
        const tokenId = tokenIds[i]
        const result = call.result as Result
        const propertyResult = pokerPropertyResults[i].result as Result
        const pokerRank = (propertyResult as any).rank as BigNumber
        const pokerSuit = (propertyResult as any).suit as BigNumber

        return {
          tokenId,
          pokerInfo: Object.assign(
            singlePokerRankMap.get(pokerRank.toNumber()),
            singlePokerSuitMap.get(pokerSuit.toNumber())
          ),
          pairId: result.length ? result[0] : ''
        }
      })
    }

    return []
  }, [loading, error, tokenIds, pairIdResults, pokerPropertyResults])

  return pairIds
}

interface usePositionResults {
  loading: boolean
  position: PositionDetails | undefined
}

export function usePairById(pairId: string, tokenId: string): any {
  const pairContract = useContract(pairId, XKeyPairABI)
  const positionManager = useNFTPositionManagerContract()
  const xKeyDaoContract = useXKeyDaoContract()
  const tokenIdBnStr = useMemo(
    () => BigNumber.from(tokenId),
    [tokenId]
  ).toString()
  const { result: token0, loading: token0Loading } = useSingleCallResult(
    pairContract,
    'token0'
  )
  const { result: token1, loading: token1Loading } = useSingleCallResult(
    pairContract,
    'token1'
  )
  const { result: totalSupplyResult, loading: totalSupplyLoading } =
    useSingleCallResult(pairContract, 'totalSupply')
  const { result: balanceOfResult, loading: balanceOfLoading } =
    useSingleCallResult(pairContract, 'balanceOf', [tokenIdBnStr])
  const { result: tokenURIResult, loading: tokenURILoading } =
    useSingleCallResult(positionManager, 'tokenURI', [tokenIdBnStr])

  const tokenAddressResults = useSingleContractMultipleData(
    xKeyDaoContract,
    'swaptoken_addrs',
    [[0], [1]]
  )

  const token0Address = Array.isArray(token0) && token0.length ? token0[0] : ''
  const token1Address = Array.isArray(token1) && token1.length ? token1[0] : ''

  const token0Token = useToken(token0Address)
  const token1Token = useToken(token1Address)

  const token0Contract = useTokenContract(token0Address)
  const token1Contract = useTokenContract(token1Address)

  const { result: token0BalanceOf, loading: t0balanceOfLoading } =
    useSingleCallResult(token0Contract, 'balanceOf', [pairId])
  const { result: token1BalanceOf, loading: t1balanceOfLoading } =
    useSingleCallResult(token1Contract, 'balanceOf', [pairId])

  const balanceOf = (
    Array.isArray(balanceOfResult) ? balanceOfResult[0] : BigNumber.from(0)
  ).toString()
  const totalSupply = (
    Array.isArray(totalSupplyResult) ? totalSupplyResult[0] : BigNumber.from(1)
  ).toString()

  const token0Amount = (
    Array.isArray(token0BalanceOf) ? token0BalanceOf[0] : BigNumber.from(0)
  ).toString()
  const token1Amount = (
    Array.isArray(token1BalanceOf) ? token1BalanceOf[0] : BigNumber.from(0)
  ).toString()

  return {
    loading: or(
      token0Loading,
      token1Loading,
      balanceOfLoading,
      tokenURILoading,
      totalSupplyLoading,
      t0balanceOfLoading,
      t1balanceOfLoading
    ),
    pairInfo: {
      token0Address,
      token1Address,
      token0Contract,
      token1Contract,
      token0Amount: formatUnits(
        divide(
          multiply(BigInt(token0Amount), BigInt(balanceOf)),
          BigInt(totalSupply)
        ).toString(),
        token0Token?.decimals
      ),
      token1Amount: formatUnits(
        divide(
          multiply(BigInt(token1Amount), BigInt(balanceOf)),
          BigInt(totalSupply)
        ).toString(),
        token1Token?.decimals
      ),
      token0: token0Token,
      token1: token1Token,
      balanceOf: Number(formatUnits(balanceOf.toString(), 18)).toFixed(4),
      totalSupply: Array.isArray(totalSupplyResult)
        ? totalSupplyResult[0]
        : BigNumber.from(1),
      tokenURI: Array.isArray(tokenURIResult) ? tokenURIResult[0] : '',
      shared: formatUnits(
        BigNumber.from(balanceOf).mul(1000000).div(totalSupply),
        4
      ),
      supportMining: tokenAddressResults.some(
        (res) => !res.loading && res.result?.includes(pairId)
      )
    }
  }
}

export function usePositions(
  account: string | null | undefined
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

  const pairIdResults = usePairsFromTokenIds(tokenIds)

  return {
    loading: or(balanceOfLoading, anyLoading),
    positions: pairIdResults
  }
}

export function useCurrentLiquidity(
  tokenId: string | string[] | undefined,
  pairId: string | string[] | undefined
) {
  if (pairId && tokenId) {
    const { loading: pairInfoLoading, pairInfo } = usePairById(
      pairId as string,
      tokenId as string
    )
    const positionManager = useNFTPositionManagerContract()
    const { loading: propertyResultLoading, result: propertyResult } =
      useSingleCallResult(positionManager, 'getPokerProperty', [tokenId])
    if (pairInfoLoading && propertyResultLoading)
      return { haveLiquidity: false }

    const pokerRank = (propertyResult as any).rank as BigNumber
    const pokerSuit = (propertyResult as any).suit as BigNumber
    return {
      haveLiquidity: true,
      pairInfo,
      pokerInfo: Object.assign(
        singlePokerRankMap.get(pokerRank.toNumber()),
        singlePokerSuitMap.get(pokerSuit.toNumber())
      )
    }
  }
  return {
    haveLiquidity: false
  }
}
