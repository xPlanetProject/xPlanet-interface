import { PokerType } from '@/utils/poker'

export type PokerItemType = {
  id: string
  pokerType: PokerType
  pokerNumber: string
  amount?: string
  miningPower?: string
}
