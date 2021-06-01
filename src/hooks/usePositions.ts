import { useSingleCallResult, useSingleContractMultipleData, Result } from '@/state/multicall/hooks'
import { useMemo, useRef } from 'react'
import { useAsyncMemo } from 'use-async-memo'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { abi as XKeyPairABI } from '@/constants/contracts/XKeyPair.json'
import { useNFTPositionManagerContract, useContract, useXKeyDaoContract } from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks'
import { getContract } from '@/utils'
import { makeToken } from '@/utils/makeToken'
import { singlePokerMap, SinglePokerItem } from '@/pokers'

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

function usePairsFromTokenIds(tokenIds: BigNumber[] | undefined): Array<PositionTokenPair> {
  const positionManager = useNFTPositionManagerContract()
  const inputs = useMemo(() => (tokenIds ? tokenIds.map((tokenId) => [BigNumber.from(tokenId)]) : []), [tokenIds])
  const pairIdResults = useSingleContractMultipleData(positionManager, 'getPair', inputs)
  const pokerPropertyResults = useSingleContractMultipleData(positionManager, 'getPokerProperty', inputs)

  const loading = useMemo(() => [...pairIdResults, ...pokerPropertyResults].some(({ loading }) => loading), [pairIdResults, pokerPropertyResults])
  const error = useMemo(() => [...pairIdResults, ...pokerPropertyResults].some(({ error }) => error), [pairIdResults, pokerPropertyResults])

  const pairIds = useMemo(() => {
    if (!loading && !error && tokenIds) {
      return pairIdResults.map((call, i) => {
        const tokenId = tokenIds[i]
        const result = call.result as Result
        const propertyResult = pokerPropertyResults[i].result as Result
        const pokerRank = (propertyResult as any).rank as BigNumber
        const pockerSuit = pokerRank.toNumber()

        return {
          tokenId,
          pokerInfo: singlePokerMap.get(pockerSuit),
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
  const { library } = useActiveWeb3React()
  const positionManager = useNFTPositionManagerContract()
  const xKeyDaoContract = useXKeyDaoContract()
  const tokenIdBN = useMemo(() => BigNumber.from(tokenId), [tokenId])
  const { result: token0, loading: token0Loading } = useSingleCallResult(pairContract, 'token0')
  const { result: token1, loading: token1Loading } = useSingleCallResult(pairContract, 'token1')
  const tokenAddressResults = useSingleContractMultipleData(xKeyDaoContract, 'swaptoken_addrs', [
    [0],
    [1]
  ])

  const pairInfo = useAsyncMemo(async() => {
    const info: any = {}
    const balanceOf = await pairContract?.balanceOf(tokenIdBN)
    const tokenURI = await positionManager?.tokenURI(tokenIdBN)

    info.balanceOf = balanceOf
    info.tokenURI = tokenURI

    info.token0Address = Array.isArray(token0) && token0.length ? token0[0] : undefined
    info.token1Address = Array.isArray(token1) && token1.length ? token1[0] : undefined

    if (info.token0Address && library) {
      info.token0 = await makeToken(info.token0Address, library)
    }

    if (info.token1Address && library) {
      info.token1 = await makeToken(info.token1Address, library)
    }

    info.supportMining = tokenAddressResults.some((res) => !res.loading && res.result?.includes(pairId))
    return info
  }, [pairContract, positionManager, tokenIdBN, token0, token1, library, tokenAddressResults, pairId])

  return {
    loading: token0Loading || token1Loading,
    pairInfo
  }
}

export function usePositions(account: string | null | undefined): usePositionsResults | any {
  const positionManager = useNFTPositionManagerContract()
  const { library } = useActiveWeb3React()
  const loading = useRef(true)

  const { result: balanceResult } = useSingleCallResult(positionManager, 'balanceOf', [
    account
  ])

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

  const tokenIdResults = useSingleContractMultipleData(positionManager, 'tokenOfOwnerByIndex', tokenIdsArgs)

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

  const pairMaps = useAsyncMemo(async() => {
    const res: any = []
    for (const { pairId, tokenId, pokerInfo } of pairIdResults) {
      if (library && account) {
        const contract = getContract(
          pairId,
          XKeyPairABI,
          library,
          account
        )

        const token0Address = await contract.token0()
        const token1Address = await contract.token1()
        const balanceOf = await contract.balanceOf(tokenId)

        const token0Token = await makeToken(token0Address, library)
        const token1Token = await makeToken(token1Address, library)

        res.push({
          token0Address,
          token1Address,
          balanceOf,
          pairId,
          tokenId,
          token0Token,
          token1Token,
          pokerInfo
        })
      }
    }

    loading.current = false
    return res
  }, [library, account, pairIdResults])

  return {
    loading: loading.current,
    positions: pairMaps
  }
}