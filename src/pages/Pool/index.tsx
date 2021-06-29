import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import CTACards from './CTACards'
import {
  Dots,
  PageWrapper,
  TitleRow,
  ButtonRow,
  ResponsiveButtonPrimary,
  ResponsiveButtonSecondary,
  LiquidityWrapper
} from './styleds'
import { LightCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import FullPositionCard from '@/components/PositionCard/FullPositionCard'
import Question from '@/components/QuestionHelper'
import { AutoRow } from '@/components/Row'
import { useActiveWeb3React } from '@/hooks'
import { usePositions } from '@/hooks/usePositions'
import { TYPE, HideSmall } from '@/theme'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const { positions, loading: positionsLoading } = usePositions(account)

  return (
    <>
      <PageWrapper>
        <AutoColumn gap='lg' justify='center'>
          <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
            <HideSmall>
              <TYPE.black fontWeight='bold' fontSize='22px'>
                {t('Pools Overview')}
              </TYPE.black>
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
              <AutoRow padding={'8px 8px 15px'}>
                <Text color={theme.text1} fontWeight='bold'>
                  {t('Your Liquidity')}
                </Text>
                <Question text='When you add liquidity, you are given pool NFT that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.' />
              </AutoRow>

              {!account ? (
                <LightCard padding='40px'>
                  <TYPE.body color={theme.text3} textAlign='center'>
                    {t('Connect to a wallet to view your liquidity.')}
                  </TYPE.body>
                </LightCard>
              ) : positionsLoading ? (
                <LightCard padding='40px'>
                  <TYPE.body color={theme.text3} textAlign='center'>
                    <Dots>{t('Loading')}</Dots>
                  </TYPE.body>
                </LightCard>
              ) : positions?.length > 0 ? (
                <>
                  {positions.map((pair, index) => (
                    <FullPositionCard key={index} pair={pair} />
                  ))}
                </>
              ) : (
                <LightCard padding='40px'>
                  <TYPE.body color={theme.text3} textAlign='center'>
                    {t('No liquidity found')}
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
