import React, { useContext } from 'react'

import { ThemeContext } from 'styled-components'

import { JSBI, Percent } from '@uniswap/sdk'

import { DarkCard, LightCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import { RowBetween } from '@/components/Row'
import { useTotalSupply } from '@/data/TotalSupply'
import Badge from '@/components/Badge'
import { useActiveWeb3React } from '@/hooks'
import { TYPE } from '@/theme'
import { useTokenBalance } from '@/state/wallet/hooks'

import { Label } from './styleds'

type LiquidityInfoProps = {
  pair: any
}

const LiquidityInfo: React.FC<LiquidityInfoProps> = ({ pair }: LiquidityInfoProps) => {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

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
          <Label>Liquidity</Label>
          <TYPE.largeHeader
              color={theme.text1}
              fontSize='36px'
              fontWeight={500}>
              $ 189.45
            </TYPE.largeHeader>
        </AutoColumn>
        <LightCard padding='12px 16px'>
          <AutoColumn gap='md'>
            <RowBetween>
              <TYPE.main>BAT</TYPE.main>
              <Badge>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Badge>
            </RowBetween>
            <RowBetween>
              <TYPE.main>ETH</TYPE.main>
              <Badge>{token1Deposited?.toSignificant(6)}</Badge>
            </RowBetween>
          </AutoColumn>
        </LightCard>
        <LightCard padding='12px 16px'>
          <AutoColumn gap='md'>
            <RowBetween>
              <TYPE.main>Amount</TYPE.main>
              <Badge>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Badge>
            </RowBetween>
            <RowBetween>
              <TYPE.main>Share</TYPE.main>
              <Badge>{poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}</Badge>
            </RowBetween>
          </AutoColumn>
        </LightCard>
      </AutoColumn>
    </DarkCard>
  )
}

export default React.memo(LiquidityInfo)