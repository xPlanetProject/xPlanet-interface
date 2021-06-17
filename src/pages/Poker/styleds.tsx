import { ButtonPrimary, ButtonSecondary } from '@/components/Button'
import { AutoColumn } from '@/components/Column'
import { RowBetween, AutoRow } from '@/components/Row'
import { TYPE } from '@/theme'
import { darken } from 'polished'
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

export const HoverText = styled(TYPE.main)`
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  :hover {
    color: ${({ theme }) => theme.text1};
    text-decoration: none;
  }
`

export const ResponsiveRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`

export const GridRow = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 24px;
  grid-column-gap: 24px;
  grid-template-columns: 1fr 1fr;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr;
  `};
`

export const BaseInfoItem = styled(AutoColumn)`
  flex: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 1rem;
    margin: 1.5rem 0;
  `};
`

export const PowerRow = styled(AutoRow)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`

export const PowerCard = styled.div`
  padding: 0 2.5rem;
  flex: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 1rem;
    width: 100%;
  `};
`

export const RowCenterSmallLeft = styled(RowBetween)`
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: flex-start;
  `};
`

export const PowerInfoDivider = styled.div`
  width: 90%;
  height: 1px;
  margin: 20px auto;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const PokerImage = styled.div`
  height: 90px;
  width: auto;
  margin: 1rem auto;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`

export const Separator = styled.div`
  width: 1px;
  height: auto;
  align-self: stretch;
  background-color: ${({ theme }) => theme.bg2};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 1px;
    width: auto;
    margin: 1.5rem 0;
  `};
`

export const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  border-radius: 28px;
  padding: 10px 18px;
  width: 90%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
`

export const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  border-radius: 28px;
  padding: 10px 18px;
  width: 48%;
  background-color: ${({ theme }) => theme.bg6};
  color: ${({ theme }) => theme.text5};

  &:hover,
  &:focus,
  &:active {
    background-color: ${({ theme }) => darken(0.05, theme.bg6)};
    box-shadow: none;
  }
`
