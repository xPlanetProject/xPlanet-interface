import React, { useState, useContext, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ReactComponent as DropDown } from '@/assets/images/dropdown.svg'
import CurrencyLogo from '@/components/CurrencyLogo'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import { Input as NumericalInput } from '@/components/NumericalInput'
import { RowBetween } from '@/components/Row'
import CurrencySearchModal from '@/components/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from '@/hooks'
import { useCurrencyBalance } from '@/state/wallet/hooks'
import { TYPE } from '@/theme'
import { Currency, Pair } from '@xplanet/sdk'
import { darken } from 'polished'
import styled, { ThemeContext } from 'styled-components'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3.5rem;
  padding: ${({ selected }) =>
    selected ? '0.5rem 0.5rem 0.5rem 1rem' : '0.5rem 0.75rem 0.5rem 1rem'};
  background-color: ${({ theme }) => theme.bg2};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ theme }) => theme.text1};
  box-shadow: none;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0.5rem 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ theme }) => theme.text1};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg1};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) =>
    active
      ? '  margin: 0 0.25rem 0 0.75rem;'
      : '  margin: 0 0.25rem 0 0.25rem;'}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
`

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: transparent;
  border: none;
  font-size: 0.875rem;
  color: #8f8c00;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  :hover {
    color: ${darken(0.2, '#8F8C00')};
  }
  :focus {
    color: ${darken(0.2, '#8F8C00')};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  )
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
              {account && (
                <TYPE.body
                  onClick={onMax}
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}>
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? t('Balance') +
                      ': ' +
                      selectedCurrencyBalance?.toSignificant(6)
                    : ' -'}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className='token-amount-input'
                value={value}
                fontSize='20px'
                onUserInput={(val) => {
                  onUserInput(val)
                }}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <StyledBalanceMax onClick={onMax}>{t('MAX')}</StyledBalanceMax>
              )}
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className='open-currency-select-button'
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}>
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo
                  currency0={pair.token0}
                  currency1={pair.token1}
                  size={24}
                  margin={true}
                />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'24px'} />
              ) : null}
              {pair ? (
                <StyledTokenName className='pair-name-container'>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName
                  className='token-symbol-container'
                  active={Boolean(currency && currency.symbol)}>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length
                      )
                    : currency?.symbol) || t('selectToken')}
                </StyledTokenName>
              )}
              {!disableCurrencySelect && <StyledDropDown />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}
