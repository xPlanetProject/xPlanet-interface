import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import LiquidityInfo from './LiquidityInfo'
import PriceInfo from './PriceInfo'
import {
  PageWrapper,
  ResponsiveRow,
  HoverText,
  ResponsiveButtonPrimary,
  ResponsiveButtonSecondary
} from './styleds'
import { ButtonGray } from '@/components/Button'
import { DarkCard, LightCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import { NFT } from '@/components/NFT'
import { RowFixed } from '@/components/Row'
import { usePairById } from '@/hooks/usePositions'
import { Dots } from '@/pages/Pool/styleds'
import { TYPE } from '@/theme'
import { currencyId } from '@/utils/currencyId'
import { unwrappedToken } from '@/utils/wrappedCurrency'
import { ThemeContext } from 'styled-components'

type PageParams = {
  pairId: string
  tokenId: string
}

export default function PoolDetail() {
  const [t] = useTranslation()
  const params = useParams<PageParams>()
  const theme = useContext(ThemeContext)

  const { loading, pairInfo } = usePairById(params.pairId, params.tokenId)

  if (loading) {
    return (
      <PageWrapper>
        <LightCard padding='40px'>
          <TYPE.body color={theme.text3} textAlign='center'>
            <Dots>Loading</Dots>
          </TYPE.body>
        </LightCard>
      </PageWrapper>
    )
  }

  const currency0 = unwrappedToken(pairInfo.token0)
  const currency1 = unwrappedToken(pairInfo.token1)

  return (
    <PageWrapper>
      <AutoColumn gap='md'>
        <AutoColumn gap='sm'>
          <Link
            style={{
              textDecoration: 'none',
              width: 'fit-content',
              marginBottom: '0.5rem'
            }}
            to='/pool'>
            <HoverText>{'← Back to Pools Overview'}</HoverText>
          </Link>
          <ResponsiveRow>
            <RowFixed>
              <DoubleCurrencyLogo
                currency0={currency0}
                currency1={currency1}
                size={24}
                margin={true}
              />
              <TYPE.label fontSize={'24px'} mr='10px'>
                &nbsp;{currency0?.symbol}&nbsp;/&nbsp;{currency1?.symbol}
              </TYPE.label>
            </RowFixed>
            <RowFixed>
              <ResponsiveButtonSecondary
                as={Link}
                to={`/add/${currencyId(currency1)}/${currencyId(
                  currency0
                )}?tokenId=${params.tokenId}`}
                width='fit-content'
                padding='6px 8px'
                borderRadius='12px'
                style={{ marginRight: '8px' }}>
                {t('Increase Liquidity')}
              </ResponsiveButtonSecondary>
              <ResponsiveButtonSecondary
                as={Link}
                to={`/remove/${currencyId(currency1)}/${currencyId(
                  currency0
                )}?tokenId=${params.tokenId}&pairId=${params.pairId}`}
                width='fit-content'
                padding='6px 8px'
                borderRadius='12px'>
                {t('Remove Liquidity')}
              </ResponsiveButtonSecondary>
              {pairInfo.supportMining && (
                <ResponsiveButtonPrimary
                  as={Link}
                  to={`/poker/${params.pairId}`}
                  width='fit-content'
                  padding='6px 8px'
                  borderRadius='12px'
                  style={{ marginLeft: '8px' }}>
                  {t('Mining')}
                </ResponsiveButtonPrimary>
              )}
            </RowFixed>
          </ResponsiveRow>
        </AutoColumn>
        <ResponsiveRow align='flex-start'>
          <DarkCard
            width='100%'
            height='100%'
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-around',
              marginRight: '12px'
            }}>
            <div style={{ marginRight: 12 }}>
              <NFT image={pairInfo.tokenURI} height={400} />
            </div>
          </DarkCard>
          <AutoColumn gap='sm' style={{ width: '100%', height: '100%' }}>
            <LiquidityInfo pair={pairInfo} />
            <PriceInfo pair={pairInfo} />
          </AutoColumn>
        </ResponsiveRow>
      </AutoColumn>
    </PageWrapper>
  )
}
