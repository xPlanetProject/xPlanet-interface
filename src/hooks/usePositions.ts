import { useSingleCallResult, useSingleContractMultipleData, Result } from '@/state/multicall/hooks'
import { useMemo } from 'react'
import { useAsyncMemo } from 'use-async-memo'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { abi as XKeyPairABI } from '@/constants/contracts/XKeyPair.json'
import { useNFTPositionManagerContract } from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks'
import { getContract } from '@/utils'

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

type PositionTokenPairId = {
  tokenId: BigNumber
  pairId: string
}

interface usePositionsResults {
  loading: boolean
  pairIds: Array<PositionTokenPairId>
}

function usePairsFromTokenIds(tokenIds: BigNumber[] | undefined): Array<PositionTokenPairId> {
  const positionManager = useNFTPositionManagerContract()
  const inputs = useMemo(() => (tokenIds ? tokenIds.map((tokenId) => [BigNumber.from(tokenId)]) : []), [tokenIds])
  const pairIdResults = useSingleContractMultipleData(positionManager, 'getPair', inputs)

  const loading = useMemo(() => pairIdResults.some(({ loading }) => loading), [pairIdResults])
  const error = useMemo(() => pairIdResults.some(({ error }) => error), [pairIdResults])

  const pairIds = useMemo(() => {
    if (!loading && !error && tokenIds) {
      return pairIdResults.map((call, i) => {
        const tokenId = tokenIds[i]
        const result = call.result as Result

        return {
          tokenId,
          pairId: result.length ? result[0] : ''
        }
      })
    }

    return []
  }, [loading, error, tokenIds, pairIdResults])

  return pairIds
}

function usePairBalanceOf(pairMaps: PairMapItem[]) {
  let tradePairs: any = []
  for (const pairMap of pairMaps) {
    tradePairs.push(useSingleContractMultipleData(pairMap.contract, pairMap.method, pairMap.input))
  }

  // const loading = useMemo(() => tradePairs.some(({ loading }) => loading), [tradePairs])
  // const error = useMemo(() => tradePairs.some(({ error }) => error), [tradePairs])

  console.log(tradePairs)

  // const { result: balanceResult } = useSingleCallResult(positionManager, 'balanceOf', [
  //   account
  // ])
}

interface usePositionResults {
  loading: boolean
  position: PositionDetails | undefined
}

export function usePositionFromTokenId(tokenId: BigNumber | undefined): any {
  const position = usePairsFromTokenIds(tokenId ? [tokenId] : undefined)
  return []
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

  const pairMaps = useAsyncMemo(async() => {
    const res: any = []
    for (const { pairId, tokenId } of pairIdResults) {
      if (library && account) {
        const contract = getContract(
          pairId,
          XKeyPairABI,
          library,
          account
        )
    
        const token0 = await contract.token0()
        const token1 = await contract.token1()
        const balanceOf = await contract.balanceOf(tokenId)

        console.log(contract)

        res.push({
          token0,
          token1,
          balanceOf,
          pairId
        })
      }
    }

    return res
  }, [library, account, pairIdResults])

  console.log(pairMaps)

  return {
    loading: false,
    positions: pairMaps
  }
}