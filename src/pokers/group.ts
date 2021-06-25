import { singlePokerRankMap, singlePokerSuitMap } from './single'
import { BigNumber } from '@ethersproject/bignumber'

export type GroupPokerItem = {
  suit: number | string
  rank: number
  face: string | Array<string>
}

const pokerMap = new Map<number, GroupPokerItem>()

export const groupPokerMap = pokerMap

let pokerTypeMap = new Map<number, string>()
pokerTypeMap.set(1, 'ROYAL FLUSH')
pokerTypeMap.set(2, 'STRAIGHT FLUSH')
pokerTypeMap.set(3, 'FOUR OF A KIND')
pokerTypeMap.set(4, 'FULL HOUSE')
pokerTypeMap.set(5, 'FLUSH')
pokerTypeMap.set(6, 'STRAIGHT')
pokerTypeMap.set(7, 'THREE OF A KIND')
pokerTypeMap.set(8, 'TWO PAIR')
pokerTypeMap.set(9, 'ONE PAIR')
pokerTypeMap.set(10, 'HIGH CARD')

export const combinePokerTypeMap = pokerTypeMap

export function compositeType(poker) {
  let totalNumber = BigNumber.from(0)
  let totalLp = BigNumber.from(0)
  let pokerTypeNumber = 0
  let isFlush = true
  let isStraight = true
  let state = 0
  let error = ''

  for (let i = 0; i < 5; i++) {
    const { lp } = poker[i]
    const { rank, suit } = poker[i].pokerInfo
    poker[i].rankFace = singlePokerRankMap.get(rank)
    poker[i].suitFace = singlePokerSuitMap.get(suit)
    totalLp = totalLp.add(lp)
    totalNumber = totalNumber.add(rank)

    if (
      i > 0 &&
      poker[i].pokerInfo.suit != poker[i - 1].pokerInfo.suit &&
      isFlush
    ) {
      isFlush = false
    }

    for (let j = i; j > 0; j--) {
      if (poker[j].pokerInfo.rank <= poker[j - 1].pokerInfo.rank) {
        if (poker[j].pokerInfo.rank == poker[j - 1].pokerInfo.rank) {
          error = 'Cannot add same poker'
        }
        let tmp = poker[j - 1].pokerInfo.rank
        poker[j - 1].pokerInfo.rank = poker[j].pokerInfo.rank
        poker[j].pokerInfo.rank = tmp
        tmp = poker[j - 1].pokerInfo.suit
        poker[j - 1].pokerInfo.suit = poker[j].pokerInfo.suit
        poker[j].pokerInfo.suit = tmp
      }
    }
  }

  for (let x = 1; x < 5; x++) {
    if (poker[x].pokerInfo.rank == poker[x - 1].pokerInfo.rank) {
      isStraight = false
      if (state == 0) {
        state = 1
      } else if (state == 1) {
        state = 3
      } else if (state == 2) {
        state = 5
      } else if (state == 3) {
        state = 7
      } else if (state == 5 || state == 4) {
        state = 6
      }
    } else {
      if (poker[x].pokerInfo.rank != poker[x - 1].pokerInfo.rank + 1) {
        isStraight = false
      }
      if (state == 1) {
        state = 2
      } else if (state == 3) {
        state = 4
      }
    }
  }

  if (isFlush) {
    if (isStraight) {
      if (poker[0].pokerInfo.rank == 10) {
        totalNumber = totalNumber.add(540).mul(totalLp)
        pokerTypeNumber = 1
      } else {
        totalNumber = totalNumber.add(455).mul(totalLp)
        pokerTypeNumber = 2
      }
    } else {
      totalNumber = totalNumber.add(275).mul(totalLp)
      pokerTypeNumber = 5
    }
  } else {
    if (state == 7) {
      totalNumber = totalNumber.add(395).mul(totalLp)
      pokerTypeNumber = 3
    } else if (state == 1 || state == 2) {
      totalNumber = totalNumber.add(55).mul(totalLp)
      pokerTypeNumber = 9
    } else if (state == 3 || state == 4) {
      totalNumber = totalNumber.add(165).mul(totalLp)
      pokerTypeNumber = 7
    } else if (state == 5) {
      totalNumber = totalNumber.add(110).mul(totalLp)
      pokerTypeNumber = 8
    } else if (state == 6) {
      totalNumber = totalNumber.add(335).mul(totalLp)
      pokerTypeNumber = 4
    } else {
      if (isStraight) {
        totalNumber = totalNumber.add(215).mul(totalLp)
        pokerTypeNumber = 6
      } else {
        totalNumber = totalNumber.add(15).mul(totalLp)
        pokerTypeNumber = 10
      }
    }
  }

  return {
    error,
    poker,
    combineType: pokerTypeMap.get(pokerTypeNumber),
    totalLp,
    totalNumber
  }
}
