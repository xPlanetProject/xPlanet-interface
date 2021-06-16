import { ButtonPrimary, ButtonSecondary } from '@/components/Button'
import { AutoColumn } from '@/components/Column'
import { RowBetween, RowFixed } from '@/components/Row'
import { darken } from 'polished'
import { Text } from 'rebass'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
`

export const ClickableText = styled(Text)`
  :hover {
    cursor: pointer;
  }
  color: ${({ theme }) => theme.primary1};
`
export const MaxButton = styled.button<{ width: string }>`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0.25rem 0.5rem;
  `};
  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: ${({ theme }) => theme.primary1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

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

export const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.text2};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

export const ButtonRow = styled(RowFixed)`
  & > *:not(:last-child) {
    margin-right: 8px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  `};
`

export const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  border-radius: 28px;
  padding: 10px 18px;
  width: fit-content;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1 1 auto;
    width: 49%;
    `};
`

export const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  border-radius: 28px;
  padding: 10px 18px;
  width: fit-content;
  background-color: ${({ theme }) => theme.bg6};
  color: ${({ theme }) => theme.text5};

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

export const LiquidityWrapper = styled.div`
  border-radius: 20px;
  padding: 8px;
  ${({ theme }) => `background: ${theme.bg1};`};
`
