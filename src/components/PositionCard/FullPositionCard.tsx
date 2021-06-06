import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import Badge from '@/components/Badge'
import Card from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import { RowBetween, RowFixed } from '@/components/Row'
import { Dots } from '@/components/swap/styleds'
import { PositionTokenPair } from '@/hooks/usePositions'
import { usePairById } from '@/hooks/usePositions'
import { unwrappedToken } from '@/utils/wrappedCurrency'
import { Text } from 'rebass'
import styled from 'styled-components'

const HoverCard = styled(Card)`
  padding: 10px;
  transition: all 0.2s;
  margin: 0 0 10px;
  ${({ theme }) => `background: ${theme.bg2};`};
  :hover {
    background: ${({ theme }) => theme.bg3};
  }
`

const CenterAutoColumn = styled(AutoColumn)`
  text-align: center;
`

const LinkRow = styled(RowBetween)`
  height: 24px;
  cursor: pointer;
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

interface PositionCardProps {
  pair: PositionTokenPair | any
  showUnwrapped?: boolean
  border?: string
}

export default function FullPositionCard({ pair, border }: PositionCardProps) {
  const history = useHistory()

  const { pairInfo, loading } = usePairById(pair.pairId, pair.tokenId)

  const toDetail = useCallback(() => {
    const tokenId = pair.tokenId.toString()
    history.push(`/pool/${tokenId}/${pair.pairId}`)
  }, [history, pair])

  if (loading) {
    return (
      <HoverCard border={border}>
        <CenterAutoColumn gap='12px'>
          <Dots>Loading Liquidity Item...</Dots>
        </CenterAutoColumn>
      </HoverCard>
    )
  }

  const currency0 = unwrappedToken(pairInfo.token0)
  const currency1 = unwrappedToken(pairInfo.token1)

  return (
    <HoverCard border={border}>
      <AutoColumn gap='12px'>
        <LinkRow onClick={toDetail}>
          <RowFixed>
            <DoubleCurrencyLogo
              currency0={currency0}
              currency1={currency1}
              margin={true}
              size={20}
            />
            <Text fontWeight={500} fontSize={20}>
              {!currency0 || !currency1 ? (
                <Dots>Loading</Dots>
              ) : (
                `${currency0.symbol}/${currency1.symbol}`
              )}
            </Text>
          </RowFixed>
          <RowFixed>
            <RowFixed>
              <ExtentsText>Liquidity Value:</ExtentsText>
              <Badge>
                <BadgeText>$ 1000000</BadgeText>
              </Badge>
            </RowFixed>
            <RowFixed
              style={{
                marginLeft: 15
              }}>
              <ExtentsText>Poker:</ExtentsText>
              <Badge>
                <BadgeText>
                  {pair.pokerInfo?.faceIcon} {pair.pokerInfo?.face}
                </BadgeText>
              </Badge>
            </RowFixed>
          </RowFixed>
        </LinkRow>
      </AutoColumn>
    </HoverCard>
  )
}
