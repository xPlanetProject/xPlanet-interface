import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { ButtonPrimary } from '@/components/Button'
import { DarkCard } from '@/components/Card'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import { RowBetween } from '@/components/Row'
import { Dots } from '@/components/swap/styleds'
import { useMiningPoolData, useTokensFromPair } from '@/hooks/useMining'
import { unwrappedToken } from '@/utils/wrappedCurrency'
import styled from 'styled-components'

const Card = styled(DarkCard)`
  flex: 1;
  display: grid;
  padding: 2rem 6rem;
  text-align: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 2rem;
    text-align: left;
  `};
`

const RowCenter = styled(RowBetween)`
  justify-content: center;
`

const RowCenterSmallLeft = styled(RowCenter)`
  justify-content: center;
  margin: 0.5rem 0;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    text-align: left;
  `};
`

const RowBetweenItem = styled(RowBetween)`
  margin: 0.5rem 0;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  `};
`

const DataText = styled.div`
  font-weight: 600;
  font-size: 24px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 18px;
  `};
`

const Text = styled.div`
  color: ${({ theme }) => theme.text2};
  font-size: 16px;
  font-weight: bold;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`

const ExtentsText = styled.span`
  color: ${({ theme }) => theme.text3};
  font-weight: 500;
  font-size: 14px;
`
interface PairProps {
  pairId: string
}

export default function PoolListIteme({ pairId }: PairProps) {
  const { token0, token1, loading } = useTokensFromPair(pairId)

  const { singleLength, compositeLength, TVL, APR } =
    useMiningPoolData(pairId) ?? {}

  const xPokers = useMemo(() => {
    if (singleLength && compositeLength) {
      return singleLength + compositeLength
    }
    return '0'
  }, [singleLength, compositeLength])

  if (loading) {
    return (
      <Card>
        <Dots>Loading Pair</Dots>
      </Card>
    )
  }

  return (
    <Card>
      <RowCenter>
        {token0 && token1 && (
          <DoubleCurrencyLogo
            currency0={unwrappedToken(token0)}
            currency1={unwrappedToken(token1)}
            size={36}
            margin
          />
        )}
      </RowCenter>

      <RowCenterSmallLeft>
        <DataText>
          {token0?.symbol}&nbsp;/&nbsp;{token1?.symbol}
        </DataText>
      </RowCenterSmallLeft>

      <RowCenterSmallLeft>
        <ExtentsText>
          Deposit {token0?.symbol}-{token1?.symbol} xPoker <br />
          Earn XKEY
        </ExtentsText>
      </RowCenterSmallLeft>

      <RowBetweenItem>
        <ExtentsText>Staked:</ExtentsText>
        <Text>{xPokers} xPoker</Text>
      </RowBetweenItem>
      <RowBetweenItem>
        <ExtentsText>TVL:</ExtentsText>
        <Text>$ {TVL}</Text>
      </RowBetweenItem>
      <RowBetweenItem>
        <ExtentsText>APR:</ExtentsText>
        <Text>201%</Text>
      </RowBetweenItem>
      <RowBetweenItem>
        <ButtonPrimary padding='12px' as={Link} to={`/poker/${pairId}`}>
          Select
        </ButtonPrimary>
      </RowBetweenItem>
    </Card>
  )
}
