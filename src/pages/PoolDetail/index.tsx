import React, { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'

import { DarkCard, LightCard } from '@/components/Card'
import { RowFixed } from '@/components/Row'
import { AutoColumn } from '@/components/Column'
import { ButtonGray } from '@/components/Button'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import { NFT } from '@/components/NFT'
import { usePairs } from '@/data/Reserves'
import { useActiveWeb3React } from '@/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from '@/state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '@/state/wallet/hooks'
import { unwrappedToken } from '@/utils/wrappedCurrency'
import { currencyId } from '@/utils/currencyId'
import { usePairById } from '@/hooks/usePositions'
import { Dots } from '@/pages/Pool/styleds'
import { TYPE } from '@/theme'

import { PageWrapper, ResponsiveRow, HoverText, ResponsiveButtonPrimary } from './styleds'

import LiquidityInfo from './LiquidityInfo'
import PriceInfo from './PriceInfo'

type PageParams = {
  pairId: string
  tokenId: string
}

export default function PoolDetail() {
  const [ t ] = useTranslation()
  const { account } = useActiveWeb3React()
  const params = useParams<PageParams>()
  const theme = useContext(ThemeContext)

  const { pairInfo } = usePairById(params.pairId, params.tokenId)

  // const trackedTokenPairs = useTrackedTokenPairs()

  // const tokenPairsWithLiquidityTokens = useMemo(
  //   () =>
  //     trackedTokenPairs.map((tokens) => ({
  //       liquidityToken: toV2LiquidityToken(tokens),
  //       tokens
  //     })),
  //   [trackedTokenPairs]
  // )

  // const liquidityTokens = useMemo(
  //   () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
  //   [tokenPairsWithLiquidityTokens]
  // )
  // const [v2PairsBalances, fetchingV2PairBalances] =
  //   useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens)

  // // fetch the reserves for all V2 pools in which the user has a balance
  // const liquidityTokensWithBalances = useMemo(
  //   () =>
  //     tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
  //       v2PairsBalances[liquidityToken.address]?.greaterThan('0')
  //     ),
  //   [tokenPairsWithLiquidityTokens, v2PairsBalances]
  // )

  // const v2Pairs = usePairs(
  //   liquidityTokensWithBalances.map(({ tokens }) => tokens)
  // )
  // const allV2PairsWithLiquidity = v2Pairs
  //   .map(([, pair]) => pair)
  //   .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))


  // const pair = allV2PairsWithLiquidity?.[0]

  if (!pairInfo || !pairInfo.token0 || !pairInfo.token1) {
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

  // to={`/increase/${currencyId(currency0)}/${currencyId(
  //   currency1
  // )}/1/2`}
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
              <ButtonGray
                as={Link}
                to={`/increase`}
                width='fit-content'
                padding='6px 8px'
                borderRadius='12px'
                style={{ marginRight: '8px' }}>
                {t('Increase Liquidity')}
              </ButtonGray>
              <ResponsiveButtonPrimary
                as={Link}
                to={`/remove/1111`}
                width='fit-content'
                padding='6px 8px'
                borderRadius='12px'>
                {t('Remove Liquidity')}
              </ResponsiveButtonPrimary>
              {
                pairInfo.supportMining &&
                (
                  <ButtonGray
                    as={Link}
                    to={`/poker/${params.pairId}`}
                    width='fit-content'
                    padding='6px 8px'
                    borderRadius='12px'
                    style={{ marginLeft: '8px' }}>
                    {t('Mining')}
                  </ButtonGray>
                )
              }
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
