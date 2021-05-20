import React, { useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'react-feather'

import { darken } from 'polished'
import styled from 'styled-components'

import { RowBetween, AutoRow } from '@/components/Row'

import getMenus, { MenuItem } from './menus'

const activeClassName = 'ACTIVE'

const StyledMenu = styled(Menu)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledX = styled(X)`
path {
  stroke: ${({ theme }) => theme.text1};
}

> * {
  stroke: ${({ theme }) => theme.text1};
}
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }
  svg {
    margin-top: 2px;
  }
`

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 14px;
  display: inline-block;
  margin: 0 0 0 1rem;
  text-align: left;

  &.${activeClassName} {
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const StyledRowBetween = styled(RowBetween)`
  padding: 1rem;
`

const StyledAutoRow = styled(AutoRow)`
  padding: 0.5rem;
`

const MenuFlyout = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  position: fixed;
  top: 0;
  leff: 0;
  right: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
`

export function SwapPoolTabsMobile({ active }: { active: string }) {
  const [ linkMenu, setLinkMenu ] = useState<boolean>(false)
  const { t } = useTranslation()

  const toggleLinkMenu = useCallback(() => {
    setLinkMenu((oldValue) => !oldValue)
  },[])

  const menus: Array<MenuItem> = useMemo<Array<MenuItem>>(() => {
    return getMenus(t, active)
  }, [t, active])

  return (
    <StyledMenuButton>
      <StyledMenu onClick={toggleLinkMenu} />
      {
        linkMenu && (
          <MenuFlyout>
            <StyledAutoRow justify="flex-end">
              <StyledX onClick={toggleLinkMenu} />
            </StyledAutoRow>
            {
              menus.map((menu: MenuItem) => {
                return (
                  <StyledRowBetween key={menu.id} onClick={toggleLinkMenu}>
                    <StyledNavLink
                      key={menu.id}
                      id={menu.linkId}
                      to={menu.to}
                      isActive={() => menu.isActive}>
                      {menu.text}
                    </StyledNavLink>
                  </StyledRowBetween>
                )
              })
            }
          </MenuFlyout>
        )
      }
    </StyledMenuButton>
  )
}