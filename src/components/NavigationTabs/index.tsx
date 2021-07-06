import React, { useMemo } from 'react'
import { ArrowLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import getMenus, { MenuItem } from './menus'
import QuestionHelper from '@/components/QuestionHelper'
import { RowBetween } from '@/components/Row'
import useQueryString from '@/hooks/useQueryString'
import styled from 'styled-components'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 18px;
  font-weight: bold;
  display: inline-block;
  padding: 0.5rem 0.75rem;
  margin: 0 2px;
  border-radius: 3rem;

  &.${activeClassName} {
    color: ${({ theme }) => theme.text5};
    background: ${({ theme }) => theme.bg6};
  }

  :not(.${activeClassName}):hover,
  :not(.${activeClassName}):focus {
    background: ${({ theme }) => theme.bg2};
  }
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

export function SwapPoolTabs({ active }: { active: string }) {
  const { t } = useTranslation()

  const menus: Array<MenuItem> = useMemo<Array<MenuItem>>(() => {
    return getMenus(t, active)
  }, [t, active])

  return (
    <Tabs
      style={{
        marginLeft: '20px'
      }}>
      {menus.map((menu: MenuItem) => (
        <StyledNavLink
          key={menu.id}
          id={menu.linkId}
          to={menu.to}
          isActive={() => menu.isActive}>
          {menu.text}
        </StyledNavLink>
      ))}
    </Tabs>
  )
}

export function FindPoolTabs() {
  const { t } = useTranslation()

  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to='/pool'>
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{t('Import Pool')}</ActiveText>
        <QuestionHelper
          text={t(
            "Use this tool to find pairs that don't automatically appear in the interface."
          )}
        />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding }: { adding: boolean }) {
  const { t } = useTranslation()
  const query = useQueryString()
  const { pairId, tokenId } = query

  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to={`/pool/${tokenId}/${pairId}`}>
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>
          {adding ? t('Add Liquidity') : t('Remove Liquidity')}
        </ActiveText>
        <QuestionHelper
          text={adding ? t('Add Liquidity Tip') : t('Remove Liquidity Tip')}
        />
      </RowBetween>
    </Tabs>
  )
}
