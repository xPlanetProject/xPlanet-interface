import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Pair } from '@uniswap/sdk'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'

import { LightCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import FullPositionCard from '@/components/PositionCard'
import Question from '@/components/QuestionHelper'
import { RowBetween } from '@/components/Row'
import { usePairs } from '@/data/Reserves'
import { useActiveWeb3React } from '@/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from '@/state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '@/state/wallet/hooks'
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

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens
      })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )
  const [v2PairsBalances, fetchingV2PairBalances] =
    useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens)

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens)
  )
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs.length < liquidityTokensWithBalances.length ||
    v2Pairs.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

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
                to='/add/ETH'>
                {t('createPool')}
              </ResponsiveButtonSecondary>
              <ResponsiveButtonPrimary
                id='join-pool-button'
                as={Link}
                to='/add/ETH'>
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
              ) : v2IsLoading ? (
                <LightCard padding='40px'>
                  <TYPE.body color={theme.text3} textAlign='center'>
                    <Dots>Loading</Dots>
                  </TYPE.body>
                </LightCard>
              ) : allV2PairsWithLiquidity?.length > 0 ? (
                <>
                  {allV2PairsWithLiquidity.map((v2Pair) => (
                    <FullPositionCard
                      key={v2Pair.liquidityToken.address}
                      pair={v2Pair}
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
