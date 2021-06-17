import React, { useContext } from 'react'

import { Label, Separator } from './styleds'
import { DarkCard, LightCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import { RowBetween } from '@/components/Row'
import { TYPE } from '@/theme'
import useUSDCPrice from '@/utils/useUSDCPrice'
import { unwrappedToken } from '@/utils/wrappedCurrency'
import { ThemeContext } from 'styled-components'

type LiquidityInfoProps = {
  pair: any
}

const LiquidityInfo: React.FC<LiquidityInfoProps> = ({
  pair
}: LiquidityInfoProps) => {
  const theme = useContext(ThemeContext)
  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const token0UsdcPrice = useUSDCPrice(pair.token1)
  const token1UsdcPrice = useUSDCPrice(currency1)

  return (
    <DarkCard>
      <AutoColumn gap='lg' style={{ width: '100%' }}>
        <AutoColumn gap='md'>
          <Label>Liquidity</Label>
          <TYPE.largeHeader
            color={theme.text1}
            fontSize='28px'
            fontWeight={500}>
            $ {pair.balanceOfUSDT}
          </TYPE.largeHeader>
        </AutoColumn>
        <AutoColumn gap='md'>
          <RowBetween>
            <TYPE.main fontWeight='bold'>{currency0.symbol}</TYPE.main>
            <TYPE.body fontWeight='bold'>{pair.token0Amount}</TYPE.body>
          </RowBetween>
          <RowBetween>
            <TYPE.main fontWeight='bold'>{currency1.symbol}</TYPE.main>
            <TYPE.body fontWeight='bold'>{pair.token1Amount}</TYPE.body>
          </RowBetween>
        </AutoColumn>
        <Separator />
        <AutoColumn gap='md'>
          <RowBetween>
            <TYPE.main fontWeight='bold'>Amount</TYPE.main>
            <TYPE.body fontWeight='bold'>{pair.balanceOf}</TYPE.body>
          </RowBetween>
          <RowBetween>
            <TYPE.main fontWeight='bold'>Share</TYPE.main>
            <TYPE.body fontWeight='bold'>{pair.shared + '%'}</TYPE.body>
          </RowBetween>
        </AutoColumn>
      </AutoColumn>
    </DarkCard>
  )
}

export default React.memo(LiquidityInfo)
