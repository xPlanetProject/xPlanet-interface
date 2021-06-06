import { useMemo } from 'react'

import { abi as XKeyPairABI } from '@/constants/contracts/XKeyPair.json'
import { useToken } from '@/hooks/Tokens'
import {
  useContract,
  useTokenContract,
  useXKeyDaoContract,
  useXPokerPowerContract
} from '@/hooks/useContract'
import {
  useSingleCallResult,
  useSingleContractMultipleData
} from '@/state/multicall/hooks'
import { or } from '@/utils/or'
import { BigNumber, utils } from 'ethers'

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
  const xKeyDaoContract = useXKeyDaoContract()
  const tokenAddressResults = useSingleContractMultipleData(
    xKeyDaoContract,
    'swaptoken_addrs',
    [[0], [1]]
  )

  const anyLoading: boolean = useMemo(
    () => tokenAddressResults.some((callState) => callState.loading),
    [tokenAddressResults]
  )

  return {
    loading: anyLoading,
    pairIds: tokenAddressResults.map((item) => {
      return {
        id: item.result?.[0]
      }
    })
  }
}

export function useTokensFromPair(pairId) {
  const pairContract = useContract(pairId, XKeyPairABI)
  const { result: token0, loading: token0Loading } = useSingleCallResult(
    pairContract,
    'token0'
  )
  const { result: token1, loading: token1Loading } = useSingleCallResult(
    pairContract,
    'token1'
  )

  const token0Address = Array.isArray(token0) && token0.length ? token0[0] : ''
  const token1Address = Array.isArray(token1) && token1.length ? token1[0] : ''

  const token0Token = useToken(token0Address)
  const token1Token = useToken(token1Address)

  return useMemo(() => {
    return {
      loading: or(!token0Token, !token1Token),
      token0: token0Token,
      token1: token1Token
    }
  }, [token0Loading, token1Loading, token0Token, token1Token])
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

export function usePricePerLP(pairId: string | undefined) {
  const pairContract = useContract(pairId, XKeyPairABI)
  const { result: LPAmountByPair } = useSingleCallResult(
    pairContract,
    'totalSupply',
    []
  )
  const { token0Address, token1Address } = useMiningPool(pairId)
  const token0Contract = useTokenContract(token0Address)
  const token1Contract = useTokenContract(token1Address)
  const { result: token0AmountByPair } = useSingleCallResult(
    token0Contract,
    'balanceOf',
    [pairId]
  )
  const { result: token1AmountByPair } = useSingleCallResult(
    token1Contract,
    'balanceOf',
    [pairId]
  )

  // TODO
}

export function usePoolTVL(pairId: string | undefined) {
  // TODO
}

type MiningPoolData = {
  singleLength: string | undefined
  compositeLength: string | undefined
  powerAmount: string | undefined
  hadMintAmount: string | undefined
  yieldRate: string | undefined
  TVL: string | undefined
  APR: string | undefined
}

export function useMiningPoolData(
  pairId: string | undefined
): MiningPoolData | null {
  if (!pairId) return null

  const xKeyDaoContract = useXKeyDaoContract()
  const xPokerPowerContract = useXPokerPowerContract()

  const { result: singleLength } = useSingleCallResult(
    xPokerPowerContract,
    'swapTokenSingleLength',
    [pairId]
  )

  const { result: compositeLength } = useSingleCallResult(
    xPokerPowerContract,
    'swapTokenCompositeLength',
    [pairId]
  )

  const { result: swapTokenAllLiquid } = useSingleCallResult(
    xPokerPowerContract,
    'swapTokenAllLiquid',
    [pairId]
  )

  const { result: powerAmount } = useSingleCallResult(
    xKeyDaoContract,
    'swaptoken_allAmount',
    [pairId]
  )

  const { result: hadMintAmount } = useSingleCallResult(
    xKeyDaoContract,
    'swaptoken_hadmint',
    [pairId]
  )

  const currentStagePrice = useCurrentStagePrice()

  const { result: pairWeight } = useSingleCallResult(
    xKeyDaoContract,
    'swaptoken_weight',
    [pairId]
  )

  const yieldRate = useMemo(() => {
    if (pairWeight && currentStagePrice) {
      return BigNumber.from(utils.parseUnits(currentStagePrice, 3).toString())
        .div('10')
        .mul(pairWeight.toString())
    }
    return undefined
  }, [pairWeight, currentStagePrice])

  return {
    singleLength: singleLength?.[0].toString(),
    compositeLength: compositeLength?.[0].toString(),
    powerAmount: powerAmount?.[0].toString(),
    hadMintAmount: hadMintAmount?.[0].toString(),
    yieldRate: yieldRate && utils.formatUnits(yieldRate, 3).toString(),
    TVL: '0.0',
    APR: '0.0'
  }
}

type PowerRewardByAccount = {
  powerByAccount: string | undefined
  rewardByAccount: string | undefined
}

export function usePowerRewardByAccount(
  pairId: string | undefined,
  account: string | null | undefined
): PowerRewardByAccount {
  const xKeyDaoContract = useXKeyDaoContract()
  const { result: powerByAccount } = useSingleCallResult(
    xKeyDaoContract,
    'getUserShare',
    [pairId, account]
  )
  const { result: rewardByAccount } = useSingleCallResult(
    xKeyDaoContract,
    'predReward',
    [pairId]
  )

  return {
    powerByAccount: powerByAccount?.[0].toString(),
    rewardByAccount: rewardByAccount?.[0].toString()
  }
}
