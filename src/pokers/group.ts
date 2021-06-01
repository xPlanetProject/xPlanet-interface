export type GroupPokerItem = {
  suit: number | string
  rank: number
  face: string | Array<string>
}

const pokerMap = new Map<number, GroupPokerItem>()

export const groupPokerMap = pokerMap
