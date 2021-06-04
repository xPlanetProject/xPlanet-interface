import React, { useState } from 'react'

import { DarkCard, LightCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import { RowBetween } from '@/components/Row'
import RateToggle from '@/components/RateToggle'
import { TYPE } from '@/theme'
import { unwrappedToken } from '@/utils/wrappedCurrency'

import { Label, ExtentsText } from './styleds'

type LiquidityInfoProps = {
  pair: any
}

const PriceInfo: React.FC<LiquidityInfoProps> = ({ pair }: LiquidityInfoProps) => {
  const [ isReverse, toggleReverse ] = useState(false)
  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  return (
    <DarkCard>
      <AutoColumn gap='md' style={{ width: '100%' }}>
        <AutoColumn gap='md'>
          <RowBetween>
            <Label>Price</Label>
            <RateToggle
              currencyA={currency1}
              currencyB={currency0}
              isReverse={isReverse}
              handleRateToggle={() => {
                toggleReverse(() => !isReverse)
              }}
            />
          </RowBetween>
        </AutoColumn>
        <LightCard padding="12px ">
          <AutoColumn gap="8px" justify="center">
            <ExtentsText>Current price</ExtentsText>
            <TYPE.mediumHeader textAlign="center">
            { isReverse ? (pair.token0Amount / pair.token1Amount) : (pair.token1Amount / pair.token0Amount) }
            </TYPE.mediumHeader>
            <ExtentsText>{ isReverse ? currency1.symbol : currency0.symbol } per { isReverse ? currency0.symbol : currency1.symbol }</ExtentsText>
          </AutoColumn>
        </LightCard>
      </AutoColumn>
    </DarkCard>
  )
}

export default React.memo(PriceInfo)