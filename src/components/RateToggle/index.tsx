import React from 'react'
import { useTranslation } from 'react-i18next'

import { ToggleElement, ToggleWrapper } from '@/components/Toggle/MultiToggle'
import { useActiveWeb3React } from '@/hooks'
import { wrappedCurrency } from '@/utils/wrappedCurrency'
import { t } from '@lingui/macro'
import { Currency } from '@xplanet/sdk'

export default function RateToggle({
  currencyA,
  currencyB,
  isReverse,
  handleRateToggle
}: {
  currencyA: Currency
  currencyB: Currency
  isReverse: boolean
  handleRateToggle: () => void
}) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const tokenA = wrappedCurrency(currencyA, chainId)
  const tokenB = wrappedCurrency(currencyB, chainId)

  return tokenA && tokenB ? (
    <div
      style={{ width: 'fit-content', display: 'flex', alignItems: 'center' }}>
      <ToggleWrapper width='fit-content'>
        <ToggleElement
          isActive={!isReverse}
          fontSize='12px'
          onClick={handleRateToggle}>
          {currencyA.symbol + ' ' + t('Price')}
        </ToggleElement>
        <ToggleElement
          isActive={isReverse}
          fontSize='12px'
          onClick={handleRateToggle}>
          {currencyB.symbol + ' ' + t('Price')}
        </ToggleElement>
      </ToggleWrapper>
    </div>
  ) : null
}
