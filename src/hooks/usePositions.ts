import { useSingleCallResult, useSingleContractMultipleData, Result } from '@/state/multicall/hooks'
import { useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { formatUnits } from '@ethersproject/units'
import { abi as XKeyPairABI } from '@/constants/contracts/XKeyPair.json'
import { useNFTPositionManagerContract, useContract, useXKeyDaoContract, useTokenContract } from '@/hooks/useContract'
import { useAsyncMemo } from '@/hooks/useAsyncMemo'
import { useActiveWeb3React } from '@/hooks'
import { getContract } from '@/utils'
import { makeToken } from '@/utils/makeToken'
import { useToken } from '@/hooks/Tokens'
import { or } from '@/utils/or'
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
  const tokenIdBnStr = useMemo(() => BigNumber.from(tokenId), [tokenId]).toString()
  const { result: token0, loading: token0Loading } = useSingleCallResult(pairContract, 'token0')
  const { result: token1, loading: token1Loading } = useSingleCallResult(pairContract, 'token1')
  const { result: totalSupplyResult, loading: totalSupplyLoading } = useSingleCallResult(pairContract, 'totalSupply')
  const { result: balanceOfResult, loading: balanceOfLoading } = useSingleCallResult(pairContract, 'balanceOf', [tokenIdBnStr])
  const { result: tokenURIResult, loading: tokenURILoading } = useSingleCallResult(positionManager, 'tokenURI', [tokenIdBnStr])

  const tokenAddressResults = useSingleContractMultipleData(xKeyDaoContract, 'swaptoken_addrs', [
    [0],
    [1]
  ])

  const token0Address = Array.isArray(token0) && token0.length ? token0[0] : ''
  const token1Address = Array.isArray(token1) && token1.length ? token1[0] : ''

  const token0Token = useToken(token0Address)
  const token1Token = useToken(token1Address)

  const token0Contract = useTokenContract(token0Address)
  const token1Contract = useTokenContract(token1Address)

  const { result: token0BalanceOf, loading: t0balanceOfLoading } = useSingleCallResult(token0Contract, 'balanceOf', [pairId])
  const { result: token1BalanceOf, loading: t1balanceOfLoading } = useSingleCallResult(token1Contract, 'balanceOf', [pairId])

  const balanceOf = Array.isArray(balanceOfResult) ? balanceOfResult[0] : BigNumber.from(0)
  const totalSupply = Array.isArray(totalSupplyResult) ? totalSupplyResult[0] : BigNumber.from(1)

  const token0Amount = Array.isArray(token0BalanceOf) ? formatUnits(token0BalanceOf[0], token0Token?.decimals) : 0;
  const token1Amount = Array.isArray(token1BalanceOf) ? formatUnits(token1BalanceOf[0], token1Token?.decimals) : 0;

  return {
    loading: or(token0Loading, token1Loading, balanceOfLoading, tokenURILoading, totalSupplyLoading, t0balanceOfLoading, t1balanceOfLoading),
    pairInfo: {
      token0Address,
      token1Address,
      token0Contract,
      token1Contract,
      token0Amount,
      token1Amount,
      token0: token0Token,
      token1: token1Token,
      balanceOf: balanceOf.toString(),
      totalSupply: Array.isArray(totalSupplyResult) ? totalSupplyResult[0] : BigNumber.from(1),
      tokenURI: Array.isArray(tokenURIResult) ? tokenURIResult[0] : '',
      shared: balanceOf.toString() / totalSupply.toString() * 100,
      supportMining: tokenAddressResults.some((res) => !res.loading && res.result?.includes(pairId))
    }
  }
}

export function usePositions(account: string | null | undefined): usePositionsResults | any {
  const positionManager = useNFTPositionManagerContract()
  const { library } = useActiveWeb3React()

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

  console.log(pairIdResults)

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
          balanceOf: formatUnits(balanceOf, 18),
          pairId,
          tokenId,
          token0Token,
          token1Token,
          pokerInfo
        })
      }
    }
    return res
  }, [library, account, pairIdResults])

  return {
    loading: Array.isArray(pairMaps) ? pairMaps.length !== pairIdResults.length : true,
    positions: pairMaps
  }
}