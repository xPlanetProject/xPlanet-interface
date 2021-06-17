import React, { useMemo, useState, useCallback } from 'react'
import { Menu, X } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import getMenus, { MenuItem } from './menus'
import LogoBlack from '@/assets/svg/logo_black_small.svg'
import LogoWhite from '@/assets/svg/logo_white_small.svg'
import { RowBetween, AutoRow } from '@/components/Row'
import { useDarkModeManager } from '@/state/user/hooks'
import { darken } from 'polished'
import styled from 'styled-components'

const activeClassName = 'ACTIVE'

const StyledMenu = styled(Menu)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 2rem;
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
  color: ${({ theme }) => theme.text2};
  font-size: 18px;
  font-weight: bold;
  display: inline-block;
  padding: 1rem 1.25rem;
  margin: 2px 0;
  text-align: left;
  border-radius: 5rem;

  &.${activeClassName} {
    color: ${({ theme }) => theme.text5};
    background: ${({ theme }) => theme.bg6};
  }

  :not(.${activeClassName}):focus {
    background: ${({ theme }) => theme.bg2};
  }
`

const NavContainer = styled.div`
  padding: 16px;
`

const StyledAutoRow = styled(AutoRow)`
  padding: 1.75rem 1rem 1rem;
`

const MenuFlyout = styled.div`
  background-color: ${({ theme }) => theme.bg0};
  position: fixed;
  top: 0;
  leff: 0;
  right: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
`

export function SwapPoolTabsMobile({ active }: { active: string }) {
  const [linkMenu, setLinkMenu] = useState<boolean>(false)
  const { t } = useTranslation()

  const [isDark] = useDarkModeManager()

  const toggleLinkMenu = useCallback(() => {
    setLinkMenu((oldValue) => !oldValue)
  }, [])

  const menus: Array<MenuItem> = useMemo<Array<MenuItem>>(() => {
    return getMenus(t, active)
  }, [t, active])

  return (
    <StyledMenuButton>
      <StyledMenu onClick={toggleLinkMenu} />
      {linkMenu && (
        <MenuFlyout>
          <StyledAutoRow justify='space-between'>
            <LogoIcon>
              <img src={isDark ? LogoWhite : LogoBlack} alt='logo' />
            </LogoIcon>
            <StyledX onClick={toggleLinkMenu} />
          </StyledAutoRow>
          <NavContainer>
            {menus.map((menu: MenuItem) => {
              return (
                <RowBetween key={menu.id} onClick={toggleLinkMenu}>
                  <StyledNavLink
                    key={menu.id}
                    id={menu.linkId}
                    to={menu.to}
                    isActive={() => menu.isActive}>
                    {menu.text}
                  </StyledNavLink>
                </RowBetween>
              )
            })}
          </NavContainer>
        </MenuFlyout>
      )}
    </StyledMenuButton>
  )
}
