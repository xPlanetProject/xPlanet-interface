import React, { useContext } from 'react'

import { ThemeContext } from 'styled-components'

import { DarkCard, LightCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import { RowBetween } from '@/components/Row'
import Badge from '@/components/Badge'
import { TYPE } from '@/theme'
import { unwrappedToken } from '@/utils/wrappedCurrency'

import { Label } from './styleds'

type LiquidityInfoProps = {
  pair: any
}

const LiquidityInfo: React.FC<LiquidityInfoProps> = ({ pair }: LiquidityInfoProps) => {
  const theme = useContext(ThemeContext)
  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  return (
    <DarkCard>
      <AutoColumn gap='md' style={{ width: '100%' }}>
        <AutoColumn gap='md'>
          <Label>Liquidity</Label>
          <TYPE.largeHeader
              color={theme.text1}
              fontSize='28px'
              fontWeight={500}>
              $ {pair.balanceOf}
            </TYPE.largeHeader>
        </AutoColumn>
        <LightCard padding='12px 16px'>
          <AutoColumn gap='md'>
            <RowBetween>
              <TYPE.main>{ currency0.symbol }</TYPE.main>
              <Badge>{ pair.token0Amount }</Badge>
            </RowBetween>
            <RowBetween>
              <TYPE.main>{ currency1.symbol }</TYPE.main>
              <Badge>{ pair.token1Amount }</Badge>
            </RowBetween>
          </AutoColumn>
        </LightCard>
        <LightCard padding='12px 16px'>
          <AutoColumn gap='md'>
            <RowBetween>
              <TYPE.main>Amount</TYPE.main>
              {/* <Badge>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Badge> */}
            </RowBetween>
            <RowBetween>
              <TYPE.main>Share</TYPE.main>
              {/* <Badge>{poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}</Badge> */}
            </RowBetween>
          </AutoColumn>
        </LightCard>
      </AutoColumn>
    </DarkCard>
  )
}

export default React.memo(LiquidityInfo)