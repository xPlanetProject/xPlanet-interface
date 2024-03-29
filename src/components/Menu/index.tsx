import React, { useRef } from 'react'
import { Info, BookOpen, Code, PieChart, MessageCircle } from 'react-feather'

import { ReactComponent as MenuIcon } from '@/assets/images/menu.svg'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import useToggle from '@/hooks/useToggle'
import { ExternalLink } from '@/theme'
import styled from 'styled-components'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  display: flex;
  width: 35px;
  height: 35px;
  border: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  background-color: ${({ theme }) => theme.bg2};

  padding: 0.15rem 0.5rem;
  border-radius: 50%;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg3};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -13rem;
  `};
  right: 0rem;
  z-index: 100;
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const [open, toggle] = useToggle(false)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <MenuItem id='link' href='https://uniswap.org/'>
            <Info size={14} />
            About
          </MenuItem>
          <MenuItem id='link' href='https://uniswap.org/docs/v2'>
            <BookOpen size={14} />
            Docs
          </MenuItem>
          <MenuItem
            id='link'
            href='https://github.com/xPlanetProject/xPlanet-interface'>
            <Code size={14} />
            Code
          </MenuItem>
          <MenuItem id='link' href='https://discord.gg/EwFs3Pp'>
            <MessageCircle size={14} />
            Discord
          </MenuItem>
          <MenuItem id='link' href='https://uniswap.info/'>
            <PieChart size={14} />
            Analytics
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
