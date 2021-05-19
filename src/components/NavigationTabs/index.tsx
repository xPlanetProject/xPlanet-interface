import React, { useMemo } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink } from 'react-router-dom'
import { v4 } from 'uuid'

import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const activeClassName = 'ACTIVE'

type MemuItem = {
  id: string;
  linkId: string;
  to: string;
  text: string;
  isActive: boolean;
}

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
  font-size: 20px;
  display: inline-block;
  margin: 0 10px;

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

export function SwapPoolTabs({ active }: { active: String }) {
  const { t } = useTranslation()

  const menus: Array<MemuItem> = useMemo<Array<MemuItem>>(() => {
    return [
      {
        id: v4(),
        linkId: 'swap-nav-link',
        to: '/swap',
        text: t('swap'),
        isActive: active === 'swap'
      },
      {
        id: v4(),
        linkId: 'pool-nav-link',
        to: '/pool',
        text: t('pool'),
        isActive: active === 'pool'
      },
      {
        id: v4(),
        linkId: 'yield-nav-link',
        to: '/yield',
        text: t('yield'),
        isActive: active === 'yield'
      },
      {
        id: v4(),
        linkId: 'xmoon-nav-link',
        to: '/xmoon',
        text: t('xmoon'),
        isActive: active === 'xmoon'
      },
      {
        id: v4(),
        linkId: 'marketpalce-nav-link',
        to: '/marketpalce',
        text: t('marketpalce'),
        isActive: active === 'marketpalce'
      },
      {
        id: v4(),
        linkId: 'launchpad-nav-link',
        to: '/launchpad',
        text: t('launchpad'),
        isActive: active === 'launchpad'
      },
      {
        id: v4(),
        linkId: 'xnova-nav-link',
        to: '/xnova',
        text: t('xnova'),
        isActive: active === 'xnova'
      }
    ]
  }, [t, active])

  return (
    <Tabs style={{
      marginLeft: '20px'
    }}>
      {
        menus.map((menu: MemuItem) => 
        <StyledNavLink key={menu.id} id={menu.linkId} to={menu.to} isActive={() => menu.isActive}>
          {menu.text}
        </StyledNavLink>
        )
      }
      {/* <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        {t('swap')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        {t('pool')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
      收益
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
      xMoon
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
      交易市场
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
      发行
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
      借贷
      </StyledNavLink> */}
    </Tabs>
  )
}

export function FindPoolTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>Import Pool</ActiveText>
        <QuestionHelper text={"Use this tool to find pairs that don't automatically appear in the interface."} />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding }: { adding: boolean }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{adding ? 'Add' : 'Remove'} Liquidity</ActiveText>
        <QuestionHelper
          text={
            adding
              ? 'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
              : 'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
          }
        />
      </RowBetween>
    </Tabs>
  )
}
