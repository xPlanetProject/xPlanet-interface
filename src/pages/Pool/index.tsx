import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'

import { LightCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import FullPositionCard from '@/components/PositionCard'
import Question from '@/components/QuestionHelper'
import { RowBetween } from '@/components/Row'
import { useActiveWeb3React } from '@/hooks'
import { usePositions } from '@/hooks/usePositions'
import { TYPE, HideSmall } from '@/theme'

import {
  Dots,
  PageWrapper,
  TitleRow,
  ButtonRow,
  ResponsiveButtonPrimary,
  ResponsiveButtonSecondary,
  LiquidityWrapper
} from './styleds'

import CTACards from './CTACards'

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const [t] = useTranslation()

  const { positions, loading: positionsLoading } = usePositions(account)  

  return (
    <>
      <PageWrapper>
        <AutoColumn gap='lg' justify='center'>
          <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
            <HideSmall>
              <TYPE.mediumHeader>{t('Pools Overview')}</TYPE.mediumHeader>
            </HideSmall>
            <ButtonRow>
              <ResponsiveButtonSecondary
                id='join-pool-button'
                as={Link}
                to='/add/ETH?tokenId=0'>
                {t('createPool')}
              </ResponsiveButtonSecondary>
              <ResponsiveButtonPrimary
                id='join-pool-button'
                as={Link}
                to='/add/ETH?tokenId=0'>
                {t('newNFT')}
              </ResponsiveButtonPrimary>
            </ButtonRow>
          </TitleRow>

          <CTACards />

          <AutoColumn gap='12px' style={{ width: '100%' }}>
            <LiquidityWrapper>
              <RowBetween padding={'8px 8px 15px'}>
                <Text color={theme.text1} fontWeight={500}>
                  Your Liquidity
                </Text>
                <Question text='When you add liquidity, you are given pool NFT that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.' />
              </RowBetween>

              {!account ? (
                <LightCard padding='40px'>
                  <TYPE.body color={theme.text3} textAlign='center'>
                    Connect to a wallet to view your liquidity.
                  </TYPE.body>
                </LightCard>
              ) : positionsLoading ? (
                <LightCard padding='40px'>
                  <TYPE.body color={theme.text3} textAlign='center'>
                    <Dots>Loading</Dots>
                  </TYPE.body>
                </LightCard>
              ) : positions?.length > 0 ? (
                <>
                  {positions.map((pair, index) => (
                    <FullPositionCard
                      key={index}
                      pair={pair}
                    />
                  ))}
                </>
              ) : (
                <LightCard padding='40px'>
                  <TYPE.body color={theme.text3} textAlign='center'>
                    No liquidity found.
                  </TYPE.body>
                </LightCard>
              )}
            </LiquidityWrapper>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
