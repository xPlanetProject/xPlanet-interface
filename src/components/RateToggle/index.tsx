import React from 'react'
import { Currency } from '@/xplanet-sdk'
import { ToggleElement, ToggleWrapper } from '@/components/Toggle/MultiToggle'
import { useActiveWeb3React } from '@/hooks'
import { wrappedCurrency } from '@/utils/wrappedCurrency'

export default function RateToggle({
  currencyA,
  currencyB,
  isReverse,
  handleRateToggle,
}: {
  currencyA: Currency
  currencyB: Currency
  isReverse: boolean
  handleRateToggle: () => void
}) {
  const { chainId } = useActiveWeb3React()

  const tokenA = wrappedCurrency(currencyA, chainId)
  const tokenB = wrappedCurrency(currencyB, chainId)

  return tokenA && tokenB ? (
    <div style={{ width: 'fit-content', display: 'flex', alignItems: 'center' }}>
      <ToggleWrapper width="fit-content">
        <ToggleElement isActive={!isReverse} fontSize="12px" onClick={handleRateToggle}>
          {currencyA.symbol + ' price '}
        </ToggleElement>
        <ToggleElement isActive={isReverse} fontSize="12px" onClick={handleRateToggle}>
          {currencyB.symbol + ' price '}
        </ToggleElement>
      </ToggleWrapper>
    </div>
  ) : null
}
