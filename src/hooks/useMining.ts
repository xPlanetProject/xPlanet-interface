import { abi as XKeyPairABI } from '@/constants/contracts/XKeyPair.json'
import { useActiveWeb3React } from '@/hooks'
import { useToken } from '@/hooks/Tokens'
import { useAsyncMemo } from '@/hooks/useAsyncMemo'
import { useContract, useXKeyDaoContract } from '@/hooks/useContract'
import {
  useSingleCallResult,
  useSingleContractMultipleData
} from '@/state/multicall/hooks'
import { getContract } from '@/utils'
import { makeToken } from '@/utils/makeToken'
import { utils } from 'ethers'

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

export function userSwapTokenHadMint() {
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

export function useMiningList() {
  const { library } = useActiveWeb3React()
  const xKeyDaoContract = useXKeyDaoContract()
  const pairIdResults = useSingleContractMultipleData(
    xKeyDaoContract,
    'swaptoken_addrs',
    [[0], [1]]
  )

  const pairIds = pairIdResults.map((item) => {
    return item.result?.[0]
  })

  const pairMaps = useAsyncMemo(async () => {
    const res: Array<any> | any = []
    for (const pairId of pairIds) {
      if (library && pairId) {
        const contract = getContract(pairId, XKeyPairABI, library)

        const token0Address = await contract.token0()
        const token1Address = await contract.token1()

        const token0 = await makeToken(token0Address, library)
        const token1 = await makeToken(token1Address, library)

        res.push({
          id: pairId,
          token0,
          token1
        })
      }
    }
    return res
  }, [library, pairIdResults])

  return pairMaps
}

export function useMiningPool(pairId: string | undefined): any {
  if (!pairId) return null

  const pairContract = useContract(pairId, XKeyPairABI)
  const { result: token0Address } = useSingleCallResult(pairContract, 'token0')
  const { result: token1Address } = useSingleCallResult(pairContract, 'token1')

  const token0 = useToken(token0Address?.[0])
  const token1 = useToken(token1Address?.[0])

  return {
    id: pairId,
    token0Address: token0Address?.[0],
    token1Address: token1Address?.[0],
    token0,
    token1
  }
}
