import { ButtonPrimary, ButtonSecondary } from '@/components/Button'
import { AutoColumn } from '@/components/Column'
import { RowBetween } from '@/components/Row'
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

export const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  border-radius: 28px;
  padding: 10px;
  width: fit-content;
  font-size: 14px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1 1 auto;
    width: 49%;
    `};
`

export const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  border-radius: 28px;
  padding: 10px;
  width: fit-content;
  background-color: ${({ theme }) => theme.bg6};
  color: ${({ theme }) => theme.text5};
  font-size: 14px;

  &:hover,
  &:focus,
  &:active {
    background-color: ${({ theme }) => darken(0.05, theme.bg6)};
    box-shadow: none;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1 1 auto;
    width: 49%;
  `};
`

export const ResponsiveRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
    row-gap: 16px;
    width: 100%;
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

export const Label = styled(TYPE.label)`
  display: flex;
  font-size: 16px;
  justify-content: flex-start;
  align-items: center;
`

export const ExtentsText = styled.span`
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  text-align: center;
  margin-right: 4px;
  font-weight: 500;
`

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg2};
`
