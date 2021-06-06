import React from 'react'
import { Link } from 'react-router-dom'

import { ButtonPrimary } from '@/components/Button'
import { DarkCard } from '@/components/Card'
import { RowBetween } from '@/components/Row'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import { unwrappedToken } from '@/utils/wrappedCurrency'
import { Dots } from '@/components/swap/styleds'
import { useTokensFromPair } from '@/hooks/useMining'
import styled from 'styled-components'

const Card = styled(DarkCard)`
  flex: 1;
  display: grid;
  margin: 0 32px 32px;
  padding: 32px 64px;
  text-align: center;
  grid-row-gap: 18px;
  border: 2px solid ${({ theme }) => theme.primary1};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 0 32px;
  `};
`

const CardFlexCenter = styled(DarkCard)`
  flex: 1;
  display: flex;
  margin: 0 32px 32px;
  padding: 32px 64px;
  justify-content: center;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.primary1};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 0 32px;
  `};
`

const RowCenter = styled(RowBetween)`
  justify-content: center;
`

const DataText = styled.div`
  font-weight: 600;
  font-size: 24px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 18px;
  `};
`

const Text = styled.div`
  font-weight: 600;
  font-size: 16px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`

const ExtentsText = styled.span`
  color: ${({ theme }) => theme.text3};
  font-size: 14px;
`
interface PairProps {
  id: string
}

export default function PoolListItme({ id }: PairProps) {
  const { token0, token1, loading } = useTokensFromPair(id)

  if (loading) {
    return (
      <CardFlexCenter>
        <Dots>Loading Pair</Dots>
      </CardFlexCenter>
    )
  }

  return (
    <Card>
      <RowCenter>
        {
          token0 && token1 && (
            <DoubleCurrencyLogo
              currency0={unwrappedToken(token0)}
              currency1={unwrappedToken(token1)}
              size={36}
              margin
            />
          )
        }
      </RowCenter>

      <RowCenter>
        <DataText>
          {token0?.symbol}&nbsp;/&nbsp;{token1?.symbol}
        </DataText>
      </RowCenter>

      <RowCenter>
        <ExtentsText>
          Deposit {token0?.symbol}-{token1?.symbol} xPoker <br />
          Earn XKEY
        </ExtentsText>
      </RowCenter>

      <RowBetween>
        <ExtentsText>Staked:</ExtentsText>
        <Text>201 xPoker</Text>
      </RowBetween>
      <RowBetween>
        <ExtentsText>TVL:</ExtentsText>
        <Text>$2010</Text>
      </RowBetween>
      <RowBetween>
        <ExtentsText>APR:</ExtentsText>
        <Text>201%</Text>
      </RowBetween>
      <RowCenter>
        <ButtonPrimary padding='12px' as={Link} to={`/poker/${id}`}>
          Select
        </ButtonPrimary>
      </RowCenter>
    </Card>
  )
}
