import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { AutoColumn } from '@/components/Column'
import { RowBetween, RowFixed } from '@/components/Row'
import { TYPE } from '@/theme'

const PageWrapper = styled(AutoColumn)`
  max-width: 870px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 500px;
  `};
`

const ResponsiveRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
    row-gap: 16px;
    width: 100%:
  `};
`

const HoverText = styled(TYPE.main)`
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  :hover {
    color: ${({ theme }) => theme.text1};
    text-decoration: none;
  }
`

export default function PoolDetail() {
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
                currency0={currencyBase}
                currency1={currencyQuote}
                size={24}
                margin={true}
              />
              <TYPE.label fontSize={'24px'} mr='10px'>
                &nbsp;{currencyQuote?.symbol}&nbsp;/&nbsp;{currencyBase?.symbol}
              </TYPE.label>
              <Badge style={{ marginRight: '8px' }}>
                <BadgeText>
                  {new Percent(feeAmount, 1_000_000).toSignificant()}%
                </BadgeText>
              </Badge>
              <RangeBadge removed={removed} inRange={inRange} />
            </RowFixed>
            {ownsNFT && (
              <RowFixed>
                {currency0 && currency1 && feeAmount && tokenId ? (
                  <ButtonGray
                    as={Link}
                    to={`/increase/${currencyId(currency0)}/${currencyId(
                      currency1
                    )}/${feeAmount}/${tokenId}`}
                    width='fit-content'
                    padding='6px 8px'
                    borderRadius='12px'
                    style={{ marginRight: '8px' }}>
                    {t('Increase Liquidity')}
                  </ButtonGray>
                ) : null}
                {tokenId && !removed ? (
                  <ResponsiveButtonPrimary
                    as={Link}
                    to={`/remove/${tokenId}`}
                    width='fit-content'
                    padding='6px 8px'
                    borderRadius='12px'>
                    {t('Remove Liquidity')}
                  </ResponsiveButtonPrimary>
                ) : null}
              </RowFixed>
            )}
          </ResponsiveRow>
          <RowBetween></RowBetween>
        </AutoColumn>
        {/* <ResponsiveRow align='flex-start'>
          {'result' in metadata ? (
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
                <NFT image={metadata.result.image} height={400} />
              </div>
              {typeof chainId === 'number' && owner && !ownsNFT ? (
                <ExternalLink
                  href={getExplorerLink(
                    chainId,
                    owner,
                    ExplorerDataType.ADDRESS
                  )}>
                  Owner
                </ExternalLink>
              ) : null}
            </DarkCard>
          ) : (
            <DarkCard
              width='100%'
              height='100%'
              style={{
                marginRight: '12px',
                minWidth: '340px'
              }}>
              <Loader />
            </DarkCard>
          )}
          <AutoColumn gap='sm' style={{ width: '100%', height: '100%' }}>
            <DarkCard>
              <AutoColumn gap='md' style={{ width: '100%' }}>
                <AutoColumn gap='md'>
                  <Label>Liquidity</Label>
                  {fiatValueOfLiquidity?.greaterThan(new Fraction(1, 100)) ? (
                    <TYPE.largeHeader fontSize='36px' fontWeight={500}>
                      $
                      {fiatValueOfLiquidity.toFixed(2, { groupSeparator: ',' })}
                    </TYPE.largeHeader>
                  ) : (
                    <TYPE.largeHeader
                      color={theme.text1}
                      fontSize='36px'
                      fontWeight={500}>
                      $-
                    </TYPE.largeHeader>
                  )}
                </AutoColumn>
                <LightCard padding='12px 16px'>
                  <AutoColumn gap='md'>
                    <RowBetween>
                      <LinkedCurrency
                        chainId={chainId}
                        currency={currencyQuote}
                      />
                      <RowFixed>
                        <TYPE.main>
                          {inverted
                            ? position?.amount0.toSignificant(4)
                            : position?.amount1.toSignificant(4)}
                        </TYPE.main>
                        {typeof ratio === 'number' && !removed ? (
                          <Badge style={{ marginLeft: '10px' }}>
                            <TYPE.main fontSize={11}>
                              {inverted ? ratio : 100 - ratio}%
                            </TYPE.main>
                          </Badge>
                        ) : null}
                      </RowFixed>
                    </RowBetween>
                    <RowBetween>
                      <LinkedCurrency
                        chainId={chainId}
                        currency={currencyBase}
                      />
                      <RowFixed>
                        <TYPE.main>
                          {inverted
                            ? position?.amount1.toSignificant(4)
                            : position?.amount0.toSignificant(4)}
                        </TYPE.main>
                        {typeof ratio === 'number' && !removed ? (
                          <Badge style={{ marginLeft: '10px' }}>
                            <TYPE.main color={theme.text2} fontSize={11}>
                              {inverted ? 100 - ratio : ratio}%
                            </TYPE.main>
                          </Badge>
                        ) : null}
                      </RowFixed>
                    </RowBetween>
                  </AutoColumn>
                </LightCard>
              </AutoColumn>
            </DarkCard>
            <DarkCard>
              <AutoColumn gap='md' style={{ width: '100%' }}>
                <AutoColumn gap='md'>
                  <RowBetween style={{ alignItems: 'flex-start' }}>
                    <AutoColumn gap='md'>
                      <Label>Unclaimed fees</Label>
                      {fiatValueOfFees?.greaterThan(new Fraction(1, 100)) ? (
                        <TYPE.largeHeader
                          color={theme.green1}
                          fontSize='36px'
                          fontWeight={500}>
                          ${fiatValueOfFees.toFixed(2, { groupSeparator: ',' })}
                        </TYPE.largeHeader>
                      ) : (
                        <TYPE.largeHeader
                          color={theme.text1}
                          fontSize='36px'
                          fontWeight={500}>
                          $-
                        </TYPE.largeHeader>
                      )}
                    </AutoColumn>
                    {ownsNFT &&
                    (feeValue0?.greaterThan(0) ||
                      feeValue1?.greaterThan(0) ||
                      !!collectMigrationHash) ? (
                      <ButtonConfirmed
                        disabled={collecting || !!collectMigrationHash}
                        confirmed={!!collectMigrationHash && !isCollectPending}
                        width='fit-content'
                        style={{ borderRadius: '12px' }}
                        padding='4px 8px'
                        onClick={() => setShowConfirm(true)}>
                        {!!collectMigrationHash && !isCollectPending ? (
                          <TYPE.main color={theme.text1}> Collected</TYPE.main>
                        ) : isCollectPending || collecting ? (
                          <TYPE.main color={theme.text1}>
                            {' '}
                            <Dots>Collecting</Dots>
                          </TYPE.main>
                        ) : (
                          <>
                            <TYPE.main color={theme.white}>
                              Collect fees
                            </TYPE.main>
                          </>
                        )}
                      </ButtonConfirmed>
                    ) : null}
                  </RowBetween>
                </AutoColumn>
                <LightCard padding='12px 16px'>
                  <AutoColumn gap='md'>
                    <RowBetween>
                      <RowFixed>
                        <CurrencyLogo
                          currency={feeValueUpper?.currency}
                          size={'20px'}
                          style={{ marginRight: '0.5rem' }}
                        />
                        <TYPE.main>{feeValueUpper?.currency?.symbol}</TYPE.main>
                      </RowFixed>
                      <RowFixed>
                        <TYPE.main>
                          {feeValueUpper
                            ? formatTokenAmount(feeValueUpper, 4)
                            : '-'}
                        </TYPE.main>
                      </RowFixed>
                    </RowBetween>
                    <RowBetween>
                      <RowFixed>
                        <CurrencyLogo
                          currency={feeValueLower?.currency}
                          size={'20px'}
                          style={{ marginRight: '0.5rem' }}
                        />
                        <TYPE.main>{feeValueLower?.currency?.symbol}</TYPE.main>
                      </RowFixed>
                      <RowFixed>
                        <TYPE.main>
                          {feeValueLower
                            ? formatTokenAmount(feeValueLower, 4)
                            : '-'}
                        </TYPE.main>
                      </RowFixed>
                    </RowBetween>
                  </AutoColumn>
                </LightCard>
                {ownsNFT &&
                (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0)) &&
                currency0 &&
                currency1 &&
                (currencyEquals(currency0, ETHER) ||
                  currencyEquals(currency1, ETHER)) &&
                !collectMigrationHash ? (
                  <AutoColumn gap='md'>
                    <RowBetween>
                      <TYPE.main>Collect as WETH</TYPE.main>
                      <Toggle
                        id='receive-as-weth'
                        isActive={receiveWETH}
                        toggle={() =>
                          setReceiveWETH((receiveWETH) => !receiveWETH)
                        }
                      />
                    </RowBetween>
                  </AutoColumn>
                ) : null}
              </AutoColumn>
            </DarkCard>
          </AutoColumn>
        </ResponsiveRow> */}
        {/* <DarkCard>
          <AutoColumn gap='md'>
            <RowBetween>
              <RowFixed>
                <Label display='flex' style={{ marginRight: '12px' }}>
                  Price range
                </Label>
                <HideExtraSmall>
                  <>
                    <RangeBadge removed={removed} inRange={inRange} />
                    <span style={{ width: '8px' }} />
                  </>
                </HideExtraSmall>
              </RowFixed>
              <RowFixed>
                {currencyBase && currencyQuote && (
                  <RateToggle
                    currencyA={currencyBase}
                    currencyB={currencyQuote}
                    handleRateToggle={() =>
                      setManuallyInverted(!manuallyInverted)
                    }
                  />
                )}
              </RowFixed>
            </RowBetween>

            <RowBetween>
              <LightCard padding='12px' width='100%'>
                <AutoColumn gap='8px' justify='center'>
                  <ExtentsText>Min price</ExtentsText>
                  <TYPE.mediumHeader textAlign='center'>
                    {priceLower?.toSignificant(5)}
                  </TYPE.mediumHeader>
                  <ExtentsText>
                    {' '}
                    {currencyQuote?.symbol + ' per ' + currencyBase?.symbol}
                  </ExtentsText>

                  {inRange && (
                    <TYPE.small color={theme.text3}>
                      Your position will be 100% {currencyBase?.symbol} at this
                      price.
                    </TYPE.small>
                  )}
                </AutoColumn>
              </LightCard>

              <DoubleArrow>⟷</DoubleArrow>
              <LightCard padding='12px' width='100%'>
                <AutoColumn gap='8px' justify='center'>
                  <ExtentsText>Max price</ExtentsText>
                  <TYPE.mediumHeader textAlign='center'>
                    {priceUpper?.toSignificant(5)}
                  </TYPE.mediumHeader>
                  <ExtentsText>
                    {' '}
                    {currencyQuote?.symbol + ' per ' + currencyBase?.symbol}
                  </ExtentsText>

                  {inRange && (
                    <TYPE.small color={theme.text3}>
                      Your position will be 100% {currencyQuote?.symbol} at this
                      price.
                    </TYPE.small>
                  )}
                </AutoColumn>
              </LightCard>
            </RowBetween>
            <CurrentPriceCard
              inverted={inverted}
              pool={pool}
              currencyQuote={currencyQuote}
              currencyBase={currencyBase}
            />
          </AutoColumn>
        </DarkCard> */}
      </AutoColumn>
    </PageWrapper>
  )
}
