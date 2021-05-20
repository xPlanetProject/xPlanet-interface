import React, { useMemo } from 'react'
import { ArrowLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { darken } from 'polished'
import styled from 'styled-components'

import QuestionHelper from '@/components/QuestionHelper'
import { RowBetween } from '@/components/Row'

import getMenus, { MenuItem } from './menus'

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
  color: ${({ theme }) => theme.text3};
  font-size: 18px;
  display: inline-block;
  margin: 0 0 0 1rem;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
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
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to='/pool'>
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>Import Pool</ActiveText>
        <QuestionHelper
          text={
            "Use this tool to find pairs that don't automatically appear in the interface."
          }
        />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding }: { adding: boolean }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to='/pool'>
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{adding ? 'Add' : 'Remove'} Liquidity</ActiveText>
        <QuestionHelper
          text={
            adding
              ? 'When you add liquidity, you are given pool NFT representing your position. These NFT automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
              : 'Removing pool tokens converts your position back into underlying NFT at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
          }
        />
      </RowBetween>
    </Tabs>
  )
}
