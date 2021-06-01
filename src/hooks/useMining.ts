import { useXKeyDaoContract } from '@/hooks/useContract'
import { useSingleCallResult } from '@/state/multicall/hooks'
import { ethers, utils } from 'ethers'

export function useCurrentStagePrice() {
  const xKeyDaoContract = useXKeyDaoContract()
  const { result: stagePrice } = useSingleCallResult(
    xKeyDaoContract,
    'getCurrentStagePrice',
    []
  )

  const stagePriceBigN =
    Array.isArray(stagePrice) && stagePrice.length ? stagePrice[0] : 0

  return utils.formatUnits(stagePriceBigN.toString(), 18)
}

export function swapTokenHadMint() {
  const xKeyDaoContract = useXKeyDaoContract()
  const { result: stagePrice } = useSingleCallResult(
    xKeyDaoContract,
    'swaptoken_had_mint',
    []
  )

  const stagePriceBigN =
    Array.isArray(stagePrice) && stagePrice.length ? stagePrice[0] : 0

  return utils.formatUnits(stagePriceBigN.toString(), 18)
}
