import { ChainId } from '@uniswap/sdk'
import { Text } from 'rebass'
import styled from 'styled-components'

import React, { useMemo } from 'react'
import { isMobile } from 'react-device-detect'
import { useLocation } from 'react-router-dom'

import Logo from '@/assets/images/logo.png'
import LogoDark from '@/assets/images/logo.png'
import { YellowCard } from '@/components/Card'
import Menu from '@/components/Menu'
import { SwapPoolTabs } from '@/components/NavigationTabs'
import Row, { RowBetween } from '@/components/Row'
import Web3Status from '@/components/Web3Status'
import SwithTheme from '@/components/SwitchTheme'
import { useActiveWeb3React } from '@/hooks'
import { useDarkModeManager } from '@/state/user/hooks'
import { useETHBalances } from '@/state/wallet/hooks'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderRowBetweenWrapper = styled(RowBetween)`
  ${({ theme }) => {
    return `
      border-bottom: solid 1px ${theme.headerBorder};
    `
  }}
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 6rem;
  }
  ${({ theme }) => {
    return theme.mediaWidth.upToSmall`
    img { 
      width: 4.5rem;
    }
  `
  }};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()

  const location = useLocation()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[
    account ?? ''
  ]
  const [isDark] = useDarkModeManager()

  const currentActive: string = useMemo<string>(() => {
    return location.pathname.split('/')[1]
  }, [location])

  return (
    <HeaderFrame>
      <HeaderRowBetweenWrapper alignItems='center' padding='1rem'>
        <Row alignItems='center'>
          <HeaderElement>
            <Title href='.'>
              <LogoIcon>
                <img src={isDark ? LogoDark : Logo} alt='logo' />
              </LogoIcon>
              <TitleText>
                {/* <img style={{ marginLeft: '4px', marginTop: '4px' }} src={isDark ? WordmarkDark : Wordmark} alt="logo" /> */}
              </TitleText>
            </Title>
          </HeaderElement>
          <SwapPoolTabs active={currentActive} />
        </Row>
        <HeaderControls>
          <HeaderElement>
            <TestnetWrapper>
              {!isMobile && chainId && NETWORK_LABELS[chainId] && (
                <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>
              )}
            </TestnetWrapper>
            <AccountElement
              active={!!account}
              style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText
                  style={{ flexShrink: 0 }}
                  pl='0.75rem'
                  pr='0.5rem'
                  fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} ETH
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
            <SwithTheme />
          </HeaderElement>
          <HeaderElementWrap>
            <Menu />
          </HeaderElementWrap>
        </HeaderControls>
      </HeaderRowBetweenWrapper>
    </HeaderFrame>
  )
}
