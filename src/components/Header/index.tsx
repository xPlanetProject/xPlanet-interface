import React, { useMemo } from 'react'
import { MobileView, BrowserView } from 'react-device-detect'
import { useLocation } from 'react-router-dom'

import { ChainId } from '@xplanet/sdk'
import { Text } from 'rebass'
import styled from 'styled-components'

import Logo from '@/assets/svg/logo_yellow.svg'
import LogoDark from '@/assets/svg/logo_dark.svg'
import MobileLogo from '@/assets/svg/mobile_logo_yellow.svg'
import MobileLogoDark from '@/assets/svg/mobile_logo_dark.svg'
import { YellowCard } from '@/components/Card'
import Menu from '@/components/Menu'
import { SwapPoolTabs } from '@/components/NavigationTabs'
import { SwapPoolTabsMobile } from '@/components/NavigationTabs/mobile'
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
  ${({ theme }) => `border-bottom: solid 1px ${theme.headerBorder};`}
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

const HeaderMemuRow = styled(Row)`
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: space-between;
  `};
};`

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

const LogoIconMobile = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 2rem;
  }
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 0.6rem;
    justify-content: space-between;
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
        <HeaderMemuRow>
          <HeaderElement>
            <Title href='.'>
                <MobileView>
                  <LogoIconMobile>
                    <img src={isDark ? MobileLogo : MobileLogoDark} alt='logo' />  
                  </LogoIconMobile>
                </MobileView>
                <BrowserView>
                  <LogoIcon>
                    <img src={isDark ? Logo : LogoDark} alt='logo' />
                  </LogoIcon>
                </BrowserView>
            </Title>
          </HeaderElement>
          <BrowserView>
            <SwapPoolTabs active={currentActive} />
          </BrowserView>
          <MobileView>
            <SwapPoolTabsMobile active={currentActive} />
          </MobileView>
        </HeaderMemuRow>
        <HeaderControls>
          <HeaderElement>
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
            <BrowserView>
              <TestnetWrapper>
                {chainId && NETWORK_LABELS[chainId] && (
                  <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>
                )}
              </TestnetWrapper>
            </BrowserView>
          </HeaderElement>
          <HeaderElementWrap>
            <SwithTheme />
            <Menu />
          </HeaderElementWrap>
        </HeaderControls>
      </HeaderRowBetweenWrapper>
    </HeaderFrame>
  )
}
