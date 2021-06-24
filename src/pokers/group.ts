import { singlePokerRankMap, singlePokerSuitMap } from './single'

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

export function composite(poker) {
  let totalNumber = 0
  let totalLp = 0
  let pokerTypeNumber = 0
  let isFlush = true
  let isStraight = true
  let state = 0

  for (let i = 0; i < 5; i++) {
    const { rank, suit, lp } = poker[i]
    poker[i].rankFace = singlePokerRankMap.get(rank)
    poker[i].suitFace = singlePokerSuitMap.get(suit)
    totalLp += lp
    totalNumber += rank

    if (i > 0 && poker[i].suit != poker[i - 1].suit && isFlush) {
      isFlush = false
    }

    for (let j = i; j > 0; j--) {
      if (poker[j].rank <= poker[j - 1].rank) {
        if (poker[j].rank == poker[j - 1].rank) {
          throw new Error('Composite: Cannot add same poker.')
        }
        let tmp = poker[j - 1].rank
        poker[j - 1].rank = poker[j].rank
        poker[j].rank = tmp
        tmp = poker[j - 1].suit
        poker[j - 1].suit = poker[j].suit
        poker[j].suit = tmp
      }
    }
  }

  for (let x = 1; x < 5; x++) {
    if (poker[x].rank == poker[x - 1].rank) {
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
      if (poker[x].rank != poker[x - 1].rank + 1) {
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
      if (poker[0].rank == 10) {
        totalNumber = (totalNumber + 540) * totalLp
        pokerTypeNumber = 1
      } else {
        totalNumber = (totalNumber + 455) * totalLp
        pokerTypeNumber = 2
      }
    } else {
      totalNumber = (totalNumber + 275) * totalLp
      pokerTypeNumber = 5
    }
  } else {
    if (state == 7) {
      totalNumber = (totalNumber + 395) * totalLp
      pokerTypeNumber = 3
    } else if (state == 1 || state == 2) {
      totalNumber = (totalNumber + 55) * totalLp
      pokerTypeNumber = 9
    } else if (state == 3 || state == 4) {
      totalNumber = (totalNumber + 165) * totalLp
      pokerTypeNumber = 7
    } else if (state == 5) {
      totalNumber = (totalNumber + 110) * totalLp
      pokerTypeNumber = 8
    } else if (state == 6) {
      totalNumber = (totalNumber + 335) * totalLp
      pokerTypeNumber = 4
    } else {
      if (isStraight) {
        totalNumber = (totalNumber + 215) * totalLp
        pokerTypeNumber = 6
      } else {
        totalNumber = (totalNumber + 15) * totalLp
        pokerTypeNumber = 10
      }
    }
  }

  return {
    poker,
    pokerTypeNumber,
    pokerType: pokerTypeMap.get(pokerTypeNumber),
    totalLp,
    totalNumber
  }
}
