export type SinglePokerItem = {
  suit: number | string
  rank: number
  face: string | Array<string>
  faceIcon: string
}

const pokerMap = new Map<number, SinglePokerItem>()

pokerMap.set(14, {
  suit: 'BLACK',
  rank: 14,
  face: 'A',
  faceIcon: '♠'
})
pokerMap.set(13, {
  suit: 'BLACK',
  rank: 13,
  face: 'K',
  faceIcon: '♠'
})
pokerMap.set(12, {
  suit: 'BLACK',
  rank: 12,
  face: 'Q',
  faceIcon: '♠'
})
pokerMap.set(11, {
  suit: 'BLACK',
  rank: 11,
  face: 'J',
  faceIcon: '♠'
})
pokerMap.set(10, {
  suit: 'BLACK',
  rank: 10,
  face: '10',
  faceIcon: '♠'
})
pokerMap.set(9, {
  suit: 'BLACK',
  rank: 9,
  face: '9',
  faceIcon: '♠'
})
pokerMap.set(8, {
  suit: 'BLACK',
  rank: 8,
  face: '8',
  faceIcon: '♠'
})
pokerMap.set(7, {
  suit: 'BLACK',
  rank: 7,
  face: '7',
  faceIcon: '♠'
})
pokerMap.set(6, {
  suit: 'BLACK',
  rank: 6,
  face: '6',
  faceIcon: '♠'
})
pokerMap.set(5, {
  suit: 'BLACK',
  rank: 5,
  face: '5',
  faceIcon: '♠'
})
pokerMap.set(4, {
  suit: 'BLACK',
  rank: 4,
  face: '4',
  faceIcon: '♠'
})
pokerMap.set(3, {
  suit: 'BLACK',
  rank: 3,
  face: '3',
  faceIcon: '♠'
})
pokerMap.set(2, {
  suit: 'BLACK',
  rank: 2,
  face: '2',
  faceIcon: '♠'
})

type SinglePokerRankItem = {
  rank: number
  face: string | Array<string>
}
type SinglePokerSuitItem = {
  suit: number
  suitText: string
  faceIcon: string
}
const pokerRankMap = new Map<number, SinglePokerRankItem>()
const pokerSuitMap = new Map<number, SinglePokerSuitItem>()

pokerRankMap.set(14, {
  rank: 14,
  face: 'A'
})
pokerRankMap.set(13, {
  rank: 13,
  face: 'K'
})
pokerRankMap.set(12, {
  rank: 12,
  face: 'Q'
})
pokerRankMap.set(11, {
  rank: 11,
  face: 'J'
})
pokerRankMap.set(10, {
  rank: 10,
  face: '10'
})
pokerRankMap.set(9, {
  rank: 9,
  face: '9'
})
pokerRankMap.set(8, {
  rank: 8,
  face: '8'
})
pokerRankMap.set(7, {
  rank: 7,
  face: '7'
})
pokerRankMap.set(6, {
  rank: 6,
  face: '6'
})
pokerRankMap.set(5, {
  rank: 5,
  face: '5'
})
pokerRankMap.set(4, {
  rank: 4,
  face: '4'
})
pokerRankMap.set(3, {
  rank: 3,
  face: '3'
})
pokerRankMap.set(2, {
  rank: 2,
  face: '2'
})

pokerSuitMap.set(1, {
  suit: 1,
  suitText: 'Heart',
  faceIcon: '♠️'
})
pokerSuitMap.set(2, {
  suit: 2,
  suitText: 'Spade',
  faceIcon: '♥️'
})
pokerSuitMap.set(3, {
  suit: 3,
  suitText: 'Club',
  faceIcon: '♣️'
})
pokerSuitMap.set(4, {
  suit: 4,
  suitText: 'Diamond',
  faceIcon: '♦️'
})

export const singlePokerMap = pokerMap
export const singlePokerRankMap = pokerRankMap
export const singlePokerSuitMap = pokerSuitMap
