import React from 'react'
import { Currency } from 'xplant-sdk'
import { ToggleElement, ToggleWrapper } from '@/components/Toggle/MultiToggle'
import { useActiveWeb3React } from '@/hooks'
import { wrappedCurrency } from '@/utils/wrappedCurrency'

export default function RateToggle({
  currencyA,
  currencyB,
  handleRateToggle,
}: {
  currencyA: Currency
  currencyB: Currency
  handleRateToggle: () => void
}) {
  const { chainId } = useActiveWeb3React()

  const tokenA = wrappedCurrency(currencyA, chainId)
  const tokenB = wrappedCurrency(currencyB, chainId)

  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

  return tokenA && tokenB ? (
    <div style={{ width: 'fit-content', display: 'flex', alignItems: 'center' }}>
      <ToggleWrapper width="fit-content">
        <ToggleElement isActive={isSorted} fontSize="12px" onClick={handleRateToggle}>
          {isSorted ? currencyA.symbol + ' price ' : currencyB.symbol + ' price '}
        </ToggleElement>
        <ToggleElement isActive={!isSorted} fontSize="12px" onClick={handleRateToggle}>
          {isSorted ? currencyB.symbol + ' price ' : currencyA.symbol + ' price '}
        </ToggleElement>
      </ToggleWrapper>
    </div>
  ) : null
}
