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

export const singlePokerMap = pokerMap

