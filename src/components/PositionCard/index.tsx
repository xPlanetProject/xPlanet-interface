import React, { useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Card, { GreyCard } from '@/components/Card'
import Badge from '@/components/Badge'
import { AutoColumn } from '@/components/Column'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import { RowBetween, RowFixed } from '@/components/Row'
import { Dots } from '@/components/swap/styleds'
import { useTotalSupply } from '@/data/TotalSupply'
import { useActiveWeb3React } from '@/hooks'
import { useTokenBalance } from '@/state/wallet/hooks'
import { unwrappedToken } from '@/utils/wrappedCurrency'
import { JSBI } from '@xplanet/sdk'
import { PositionTokenPair } from '@/hooks/usePositions'
import { Text } from 'rebass'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  padding: 10px;
  transition: all 0.2s;
  margin: 0 0 10px;
  ${({ theme }) => `background: ${theme.bg2};`};
  :hover {
    background: ${({ theme }) => theme.bg3};
  }
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

export function MinimalPositionCard({
  pair,
  showUnwrapped = false,
  border
}: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken
  )
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

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
    <>
      {userPoolBalance && (
        <GreyCard border={border}>
          <AutoColumn gap='12px'>
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  Your position
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo
                  currency0={currency0}
                  currency1={currency1}
                  margin={true}
                  size={20}
                />
                <Text fontWeight={500} fontSize={20}>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance.toSignificant(4)}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap='4px'>
              <FixedHeightRow>
                <Text color='#888D9B' fontSize={16} fontWeight={500}>
                  {currency0.symbol}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text
                      color='#888D9B'
                      fontSize={16}
                      fontWeight={500}
                      marginLeft={'6px'}>
                      {token0Deposited.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text color='#888D9B' fontSize={16} fontWeight={500}>
                  {currency1.symbol}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text
                      color='#888D9B'
                      fontSize={16}
                      fontWeight={500}
                      marginLeft={'6px'}>
                      {token1Deposited.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, border }: PositionCardProps) {
  const history = useHistory()

  const currency0 = unwrappedToken(pair.token0Token)
  const currency1 = unwrappedToken(pair.token1Token)

  const toDetail = useCallback(() => {
    const tokenId = pair.tokenId.toString()
    history.push(`/pool/${tokenId}/${pair.pairId}`)
  }, [history, pair])

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
                  <BadgeText>$ {pair.balanceOf.toString()}</BadgeText>
                </Badge>
              </RowFixed>
              <RowFixed style={{
                marginLeft: 15
              }}>
                <ExtentsText>Poker:</ExtentsText>
                <Badge>
                  <BadgeText>{ pair.pokerInfo?.faceIcon } { pair.pokerInfo?.face }</BadgeText>
                </Badge>
              </RowFixed>
            </RowFixed>
          </LinkRow>
      </AutoColumn>
    </HoverCard>
  )
}
