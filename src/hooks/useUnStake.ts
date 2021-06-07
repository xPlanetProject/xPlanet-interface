import { useMemo } from 'react'

import { useXPokerPowerContract } from '@/hooks/useContract'
import { usePairsFromTokenIds } from '@/hooks/useStake'
import { SinglePokerItem, GroupPokerItem } from '@/pokers'
import {
  useSingleCallResult,
  useSingleContractMultipleData,
  Result
} from '@/state/multicall/hooks'
import { BigNumber } from '@ethersproject/bignumber'

export type PositionTokenPair = {
  tokenId: BigNumber
  pokerInfo: SinglePokerItem | GroupPokerItem | undefined
  pairId: string
  isSingle: boolean
  isGroup: boolean
}

interface usePositionsResults {
  loading: boolean
  pairIds: Array<PositionTokenPair>
}

export function useGetTokenIdByIndex(
  account: string | null | undefined,
  index: number
) {
  const xPokerPowerContract = useXPokerPowerContract()

  const { result: tokenId } = useSingleCallResult(
    xPokerPowerContract,
    'getTokenIdByIndex',
    [account, index]
  )
  return tokenId
}

export function uesSingleMaps(
  account: string | null | undefined,
  pairId: string
): usePositionsResults | any {
  const xPokerPowerContract = useXPokerPowerContract()

  const { result: singleLengthRes } = useSingleCallResult(
    xPokerPowerContract,
    'singleLength',
    [account]
  )
  const singleLength = singleLengthRes?.[0].toNumber() || 0

  const indexs = useMemo(() => {
    if (account && singleLength) {
      const indexs: Array<unknown> = []
      if (singleLength && account) {
        for (let i = 0; i < singleLength; i++) {
          indexs.push([account, i])
        }
      }
      return indexs
    }
    return []
  }, [account, singleLength])

  const tokenIdResults = useSingleContractMultipleData(
    xPokerPowerContract,
    'getTokenIdByIndex',
    indexs
  )

  const loading: boolean = useMemo(
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
    loading: loading,
    pokers: pairIdResults
  }
}

export function useCompositeLength(
  account: string | null | undefined,
  pairId: string
) {}
