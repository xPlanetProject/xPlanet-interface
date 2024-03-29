import { useMemo } from 'react'

import {
  usePairContract,
  useNFTPositionManagerContract,
  useXPokerPowerContract
} from '@/hooks/useContract'
import { usePairsFromTokenIds } from '@/hooks/useStake'
import {
  SinglePokerItem,
  singlePokerRankMap,
  singlePokerSuitMap
} from '@/pokers'
import { compositeType } from '@/pokers'
import {
  useSingleCallResult,
  useSingleContractMultipleData,
  Result
} from '@/state/multicall/hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { utils } from 'ethers'

export type PositionTokenPair = {
  tokenId: BigNumber
  pokerInfo: SinglePokerItem | undefined
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

export function uesUserCombineMaps(
  account: string | null | undefined,
  pairId: string
): any {
  const xPokerPowerContract = useXPokerPowerContract()

  const { result: combineLengthRes } = useSingleCallResult(
    xPokerPowerContract,
    'compositeLength',
    [account]
  )

  const combineLength = combineLengthRes?.[0].toNumber() || 0

  const indexs = useMemo(() => {
    if (account && combineLength) {
      const indexs: Array<unknown> = []
      for (let i = 0; i < combineLength; i++) {
        indexs.push([account, i])
      }
      return indexs
    }
    return []
  }, [account, combineLength])

  const combinePowerResults: Array<any> = useSingleContractMultipleData(
    xPokerPowerContract,
    'getCompositePowerdByIndex',
    indexs
  )

  const tokenIdResults: Array<any> = useSingleContractMultipleData(
    xPokerPowerContract,
    'getTokenIdsByIndex',
    indexs
  )

  const loading: boolean = useMemo(
    () =>
      tokenIdResults.some((callState) => callState.loading) &&
      combinePowerResults.some((callState) => callState.loading),
    [tokenIdResults, combinePowerResults]
  )

  let combineMap: any = []

  if (
    !loading &&
    combinePowerResults &&
    combinePowerResults.length &&
    tokenIdResults &&
    tokenIdResults.length
  ) {
    if (!tokenIdResults[0]) {
      return []
    }
    combineMap = combinePowerResults.map((call, i) => {
      const pokers = tokenIdResults[i]?.result?.[0].map((tokenId) =>
        BigNumber.from(tokenId)
      )

      return {
        index: i,
        combineType: '',
        combinePower:
          call?.result?.[0].toString() &&
          Number(utils.formatUnits(call?.result[0].toString(), 18)).toFixed(4),
        combineLPAmount: '',
        pokers: pokers
      }
    })
  }

  const pairIdResults = usePairsFromTokenIdsMap(combineMap, pairId)

  return {
    loading: loading,
    pokers: pairIdResults
  }
}

export function usePairsFromTokenIdsMap(
  combineMap: Array<any> | undefined,
  pairId: string
): any {
  const positionManager = useNFTPositionManagerContract()
  const pairContract = usePairContract(pairId)

  const inputs = useMemo(() => {
    return Array.isArray(combineMap)
      ? combineMap
          .map(({ pokers }) => {
            return pokers
          })
          .flat(2)
          .map((item) => [item])
      : []
  }, [combineMap])

  const pairIdsResults = useSingleContractMultipleData(
    positionManager,
    'getPair',
    inputs
  )
  const pokerPropertyResults = useSingleContractMultipleData(
    positionManager,
    'getPokerProperty',
    inputs
  )
  const LPAmountResults = useSingleContractMultipleData(
    pairContract,
    'balanceOf',
    inputs
  )

  const pairIds = pairIdsResults
    .map(({ result }) => result)
    .filter((result): result is Result => !!result)

  const pokerProperty = pokerPropertyResults
    .map(({ result }) => result)
    .filter((result): result is Result => !!result)

  const LPAmount = LPAmountResults.map(({ result }) => result).filter(
    (result): result is Result => !!result
  )

  const pokerMap = useMemo(() => {
    if (
      pairIds &&
      pokerProperty &&
      inputs.length &&
      pairIds.length &&
      pokerProperty.length
    ) {
      return pokerProperty.map((call, i) => {
        const tokenId = inputs[i]?.[0]
        const pairId = pairIds[i]?.[0]
        const lpResult = LPAmount[i]?.[0]
        const propertyResult = call

        const pokerRank = singlePokerRankMap.get(propertyResult.rank.toNumber())
        const pockerSuit = singlePokerSuitMap.get(
          propertyResult.suit.toNumber()
        )

        return {
          tokenId,
          tokenIdStr: tokenId?.toString(),
          pokerInfo: Object.assign(pokerRank, pockerSuit),
          pairId,
          lp: lpResult || BigNumber.from(0)
        }
      })
    }
    return []
  }, [inputs, pairIds, pokerProperty])

  const combineMapRes = useMemo(() => {
    if (combineMap && pokerMap && combineMap.length && pokerMap.length) {
      return combineMap.map((call, i) => {
        call.pokers = call.pokers
          .filter((poker) => !!poker)
          .map((poker, pi) => {
            return pokerMap.find((item) => poker.toString() == item.tokenIdStr)
          })
        return call
      })
    }
    return []
  }, [combineMap, pokerMap])

  const combineMapResult = useMemo(() => {
    return combineMapRes.map((call) => {
      call.combineLPAmount = call.pokers.reduce((pre, cur) => {
        return pre.add(cur.lp)
      }, BigNumber.from(0))
      call.combineType = compositeType(call.pokers)?.combineType
      call.combineLPAmount = Number(
        formatUnits(call.combineLPAmount, 18)
      ).toFixed(4)
      call.pokers = call.pokers.map((poker) => {
        poker.lp = Number(formatUnits(poker.lp, 18)).toFixed(4)
        return poker
      })

      return call
    })
  }, [combineMapRes])

  return combineMapResult
}
