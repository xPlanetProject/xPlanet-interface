import React from 'react'
import { Link } from 'react-router-dom'

import Badge from '@/components/Badge'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import { RowFixed } from '@/components/Row'
import { MEDIA_WIDTHS } from '@/theme'
import { Token } from '@uniswap/sdk'
import styled from 'styled-components'

const Row = styled(Link)`
  align-items: center;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.text1};
  margin: 8px 0;
  padding: 16px;
  text-decoration: none;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg2};

  &:first-of-type {
    margin: 0 0 8px 0;
  }
  &:last-of-type {
    margin: 8px 0 0 0;
  }
  & > div:not(:first-child) {
    text-align: right;
  }
  :hover {
    background-color: ${({ theme }) => theme.bg3};
  }
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    flex-direction: row;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    row-gap: 24px;
  `};
`

const PoolIdData = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > * {
    margin-right: 8px;
  }
`

const DataText = styled.div`
  font-weight: 600;
  font-size: 18px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`

const PoolData = styled.div`
  font-size: 14px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  row-gap: 4px;
`};
`

const BadgeText = styled.div`
  font-weight: 500;
  font-size: 14px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
  `};
`

const ExtentsText = styled.span`
  color: ${({ theme }) => theme.text3};
  font-size: 14px;
  margin-right: 4px;
`

interface PairProps {
  id: string
  token0: Token
  token1: Token
}

export default function PoolListItme({ id, token0, token1 }: PairProps) {
  return (
    <Row to={`/yield/${id}`}>
      <PoolIdData>
        <DoubleCurrencyLogo
          currency0={token0}
          currency1={token1}
          size={24}
          margin
        />
        <DataText>
          &nbsp;{token0?.symbol}&nbsp;/&nbsp;{token1?.symbol}
        </DataText>
      </PoolIdData>

      <PoolData>
        <RowFixed margin='0 1rem'>
          <ExtentsText>TVL:</ExtentsText>
          <Badge>
            <BadgeText>201%</BadgeText>
          </Badge>
        </RowFixed>
        <RowFixed margin='0 1rem'>
          <ExtentsText>TVL:</ExtentsText>
          <Badge>
            <BadgeText>201%</BadgeText>
          </Badge>
        </RowFixed>
        <RowFixed margin='0 1rem'>
          <ExtentsText>TVL:</ExtentsText>
          <Badge>
            <BadgeText>201%</BadgeText>
          </Badge>
        </RowFixed>
      </PoolData>
    </Row>
  )
}
