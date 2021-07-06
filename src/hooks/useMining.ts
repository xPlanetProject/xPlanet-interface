import { useMemo } from 'react'

import { abi as XKeyPairABI } from '@/constants/contracts/XKeyPair.json'
import { useToken } from '@/hooks/Tokens'
import { useV3Token } from '@/hooks/TokensV3'
import {
  useContract,
  useTokenContract,
  useXKeyDaoContract,
  useXPokerPowerContract
} from '@/hooks/useContract'
import usePromiseifyCall from '@/hooks/usePromiseifyCall'
import {
  useSingleCallResult,
  useSingleContractMultipleData
} from '@/state/multicall/hooks'
import useUSDCPrice from '@/usdc-price'
import { or } from '@/utils/or'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { BigNumber, utils } from 'ethers'
import JSBI from 'jsbi'

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

export function usePoolTVL(pairId: string | undefined) {
  const { token0Address, token1Address } = useMiningPool(pairId)
  const token0Contract = useTokenContract(token0Address)
  const token1Contract = useTokenContract(token1Address)
  const token0Token = useV3Token(token0Address)
  const token1Token = useV3Token(token1Address)

  const { result: token0AmountByPairRes } = useSingleCallResult(
    token0Contract,
    'balanceOf',
    [pairId]
  )
  const { result: token1AmountByPairRes } = useSingleCallResult(
    token1Contract,
    'balanceOf',
    [pairId]
  )
  const amount0 = token0AmountByPairRes?.[0]
  const amount1 = token1AmountByPairRes?.[0]

  // usdc prices always in terms of tokens
  const price0 = useUSDCPrice(token0Token ?? undefined)
  const price1 = useUSDCPrice(token1Token ?? undefined)

  const fiatValueOfLiquidity: CurrencyAmount<Token> | null = useMemo(() => {
    if (!price0 || !price1 || !amount0 || !amount1) return null
    const calc0 = price0.quote(amount0)
    const calc1 = price1.quote(amount1)
    return calc0.add(calc1)
  }, [price0, price1, amount0, amount1])

  return fiatValueOfLiquidity
}

export function usePricePerLP(pairId: string | undefined) {
  // TODO
  const pairContract = useContract(pairId, XKeyPairABI)
  const { result: LPAmountByPairRes } = useSingleCallResult(
    pairContract,
    'totalSupply',
    []
  )
  const LPAmount = LPAmountByPairRes?.[0]

  const fiatValueOfLiquidity = usePoolTVL(pairId)
  const lpv = useMemo(() => {
    if (!LPAmount || !fiatValueOfLiquidity) return null
    return fiatValueOfLiquidity.divide(LPAmount).toFixed(2)
  }, [LPAmount, fiatValueOfLiquidity])

  return lpv
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
    powerAmount:
      powerAmount?.[0].toString() &&
      Number(utils.formatUnits(powerAmount?.[0].toString(), 18)).toFixed(4),
    hadMintAmount:
      hadMintAmount?.[0].toString() &&
      Number(utils.formatUnits(hadMintAmount?.[0].toString(), 18)).toFixed(4),
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
  const xKeyDaoContract = useXKeyDaoContract(true)
  const { result: powerByAccount } = useSingleCallResult(
    xKeyDaoContract,
    'getUserShare',
    [pairId, account]
  )

  const { result: rewardByAccount } = usePromiseifyCall(
    xKeyDaoContract,
    'predReward',
    [pairId]
  )

  return {
    powerByAccount:
      powerByAccount?.[0].toString() &&
      Number(utils.formatUnits(powerByAccount?.[0].toString())).toFixed(4),
    rewardByAccount:
      rewardByAccount?.[0].toString() &&
      Number(utils.formatUnits(rewardByAccount?.[0].toString())).toFixed(4)
  }
}
