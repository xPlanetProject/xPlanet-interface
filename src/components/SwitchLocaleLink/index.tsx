import React, { useMemo } from 'react'
import ReactGA from 'react-ga'
import { useLocation } from 'react-router'

import { RowAround } from '@/components/Row'
import {
  DEFAULT_LOCALE,
  LOCALE_LABEL,
  SupportedLocale
} from '@/constants/locales'
import { navigatorLocale, useActiveLocale } from '@/hooks/useActiveLocale'
import useParsedQueryString from '@/hooks/useParsedQueryString'
import { StyledInternalLink, TYPE } from '@/theme'
import i18next from 'i18next'
import { stringify } from 'qs'
import styled from 'styled-components'

const Wrapper = styled(TYPE.main)`
  font-size: 11px;
  opacity: 0.6;
  margin-top: 1rem !important;

  :hover {
    opacity: 1;
  }
`

const SwitchButton = styled(StyledInternalLink)`
  color: ${({ theme }) => theme.text1};
`

export function SwitchLocaleLink() {
  const activeLocale = useActiveLocale()
  const browserLocale = useMemo(() => navigatorLocale(), [])
  const location = useLocation()
  const qs = useParsedQueryString()

  if (
    browserLocale &&
    (browserLocale !== DEFAULT_LOCALE || activeLocale !== DEFAULT_LOCALE)
  ) {
    let targetLocale: SupportedLocale
    if (activeLocale === browserLocale) {
      targetLocale = DEFAULT_LOCALE
    } else {
      targetLocale = browserLocale
    }

    const target = {
      ...location,
      search: stringify({ ...qs, lng: targetLocale })
    }

    return (
      <RowAround>
        <Wrapper>
          xPlantSwap available in:{'  '}
          {
            <SwitchButton
              onClick={() => {
                i18next.changeLanguage(targetLocale)
                ReactGA.event({
                  category: 'Localization',
                  action: 'Switch Locale',
                  label: `${activeLocale} -> ${targetLocale}`
                })
              }}
              to={target}>
              {LOCALE_LABEL[targetLocale]}
            </SwitchButton>
          }
        </Wrapper>
      </RowAround>
    )
  }
  return null
}
