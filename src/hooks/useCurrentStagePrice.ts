import { useXKeyDaoContract } from '@/hooks/useContract'
import { useSingleCallResult } from '@/state/multicall/hooks'

export function useCurrentStagePrice() {
  const xKeyDaoContract = useXKeyDaoContract()
  const { result: stagePrice } = useSingleCallResult(xKeyDaoContract, 'getCurrentStagePrice', [])
  return (Array.isArray(stagePrice) && stagePrice.length) ? stagePrice[0] : 0
}
