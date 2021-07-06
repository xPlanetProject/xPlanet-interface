import React from 'react'
import { useTranslation } from 'react-i18next'

import { DarkCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import { RowBetween } from '@/components/Row'
import { useCurrentLiquidity } from '@/hooks/usePositions'
import useQueryString from '@/hooks/useQueryString'
import styled from 'styled-components'

const Card = styled(DarkCard)`
  background-color: ${({ theme }) => theme.bg2};
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 12px;
  grid-column-gap: 12px;
  grid-template-columns: 1fr 1fr;
`

const RowBetweenItem = styled(AutoColumn)`
  text-align: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  `};
`

const TitleText = styled.span`
  color: ${({ theme }) => theme.text3};
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 5px;
`

const Text = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  font-weight: bold;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`

export default function CurrentLiquidity() {
  const query = useQueryString()
  const { tokenId, pairId } = query
  const { haveLiquidity, pairInfo, pokerInfo } = useCurrentLiquidity(
    tokenId,
    pairId
  )
  const { t } = useTranslation()
  console.log(haveLiquidity, pairInfo, pokerInfo)

  return haveLiquidity ? (
    <>
      <Card>
        <RowBetweenItem>
          <TitleText>{t('ID')}</TitleText>
          <Text>{tokenId}</Text>
        </RowBetweenItem>
        <RowBetweenItem>
          <TitleText>{t('Amount')}</TitleText>
          <Text>{pairInfo.balanceOf}</Text>
        </RowBetweenItem>
        <RowBetweenItem>
          <TitleText>{t('Share')}</TitleText>
          <Text>{pairInfo.shared + '%'}</Text>
        </RowBetweenItem>
        <RowBetweenItem>
          <TitleText>{t('Poker')}</TitleText>
          <Text>
            {pokerInfo?.faceIcon} {pokerInfo?.face}
          </Text>
        </RowBetweenItem>
      </Card>
    </>
  ) : (
    <></>
  )
}
