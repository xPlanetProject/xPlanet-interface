import React from 'react'

import { JSBI, Percent } from 'xplant-sdk'

import { DarkCard, LightCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import { RowBetween } from '@/components/Row'
import { useTotalSupply } from '@/data/TotalSupply'
import RateToggle from '@/components/RateToggle'
import { useActiveWeb3React } from '@/hooks'
import { TYPE } from '@/theme'
import { useTokenBalance } from '@/state/wallet/hooks'
import { unwrappedToken } from '@/utils/wrappedCurrency'

import { Label, ExtentsText } from './styleds'

type LiquidityInfoProps = {
  pair: any
}

const PriceInfo: React.FC<LiquidityInfoProps> = ({ pair }: LiquidityInfoProps) => {
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const userPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken
  )
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!totalPoolTokens &&
    !!userPoolBalance &&
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance,
            false
          )
        ]
      : [undefined, undefined]

  return (
    <DarkCard>
      <AutoColumn gap='md' style={{ width: '100%' }}>
        <AutoColumn gap='md'>
          <RowBetween>
            <Label>Price</Label>
            <RateToggle
              currencyA={currency0}
              currencyB={currency1}
              handleRateToggle={() => {

              }}
            />
          </RowBetween>
        </AutoColumn>
        <LightCard padding="12px ">
          <AutoColumn gap="8px" justify="center">
            <ExtentsText>Current price</ExtentsText>
            <TYPE.mediumHeader textAlign="center">
              56.8
            </TYPE.mediumHeader>
            <ExtentsText>ETH per Poker</ExtentsText>
          </AutoColumn>
        </LightCard>
      </AutoColumn>
    </DarkCard>
  )
}

export default React.memo(PriceInfo)