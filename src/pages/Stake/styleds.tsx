import { NavLink } from 'react-router-dom'

import { ButtonPrimary, ButtonError } from '@/components/Button'
import { DarkCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import { RowBetween } from '@/components/Row'
import { TYPE } from '@/theme'
import { Box } from 'rebass/styled-components'
import styled from 'styled-components'

export const PageWrapper = styled(AutoColumn)`
  max-width: 870px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 500px;
  `};
`

export const WarpperDarkCard = styled(DarkCard)`
  padding: 1rem;
`

export const NavTitleTab = styled(NavLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  font-weight: bold;
  display: inline-block;
  padding: 0.5rem 0.75rem;
  margin: 0 2px;
  border-radius: 3rem;

  &.ACTIVE {
    color: ${({ theme }) => theme.text5};
    background: ${({ theme }) => theme.bg6};
  }

  :not(.ACTIVE):hover,
  :not(.ACTIVE):focus {
    background: ${({ theme }) => theme.bg2};
  }
`

export const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.text2};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

export const TabConent = styled(Box)``

export const StakeTabConent = styled.div`
  padding: 0 1rem;
`

export const HoverText = styled(TYPE.main)`
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  :hover {
    color: ${({ theme }) => theme.text1};
    text-decoration: none;
  }
`

export const WrapperRow = styled(Box)`
  color: ${({ theme }) => theme.text1};
  font-weight: 500;
  margin: 8px 0;
  text-decoration: none;
  display: flex;
  align-items: center;
  border-radius: 6px;
  background-color: transparent;

  & > div:not(:first-child) {
    text-align: center;
  }
  & > div:last-child {
    text-align: right;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    & > div:not(:first-child) {
      text-align: left;
    }
    & > div:last-child {
      text-align: left;
    }
  `};
`

export const Row = styled(WrapperRow)<{ isHeader?: boolean }>`
  background-color: ${({ theme }) => theme.bg1};

  :hover {
    background-color: ${({ theme }) => theme.bg2};
  }

  ${({ isHeader, theme }) =>
    isHeader && `border-bottom: 1px solid ${theme.bg2};`};
`

export const Column = styled(Box)<{ flex?: string; width?: string }>`
  width: ${({ flex, width }) => flex || width || '65px'};
  flex-shrink: 0;
  padding: 1rem 0.5rem;
  overflow-wrap: break-word;
  ${({ flex }) => flex && `flex: ${flex};`};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0.75rem 0.5rem;
  `};
`

export const ActionRow = styled(RowBetween)`
  padding: 16px 0;
`

export const SelectedPoker = styled(RowBetween)`
  width: 440px;
`

export const PokerItem = styled.div`
  height: 120px;
  width: 80px;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg2};
  border: 2px solid ${({ theme }) => theme.bg3};
  cursor: pointer;

  :hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg3};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1;
    min-height: 100px;
    padding: 12px;
    margin: 0 4px;
  `};
`

export const ActionRowBetween = styled(RowBetween)`
  width: auto;
  flex-direction: column;
  align-self: stretch;
`

export const ResponsiveButtonPrimary = styled(ButtonError)`
  border-radius: 28px;
  padding: 10px 18px;
  width: 300px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
    width: 100%;
  `};
`
