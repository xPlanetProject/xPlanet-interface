import React, { Suspense } from 'react'
import { HashRouter, Route, Switch, useLocation } from 'react-router-dom'

import AddLiquidity from './AddLiquidity'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import Poker from './Poker'
import Pool from './Pool'
import PoolDetail from './PoolDetail'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Stake from './Stake'
import UnStake from './Stake/unstake'
import Swap from './Swap'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import Yield from './Yield'
import Header from '@/components/Header'
import Popups from '@/components/Popups'
import Web3ReactManager from '@/components/Web3ReactManager'
import GoogleAnalyticsReporter from '@/components/analytics/GoogleAnalyticsReporter'
import DarkModeQueryParamReader from '@/theme/DarkModeQueryParamReader'
import styled from 'styled-components'

const TestComponent = () => {
  const location = useLocation()

  return <div>{location.pathname}</div>
}

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 160px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 16px;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  return (
    <Suspense fallback={null}>
      <HashRouter>
        <Route component={GoogleAnalyticsReporter} />
        <Route component={DarkModeQueryParamReader} />
        <AppWrapper>
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <BodyWrapper>
            <Popups />
            <Web3ReactManager>
              <Switch>
                <Route exact strict path='/swap' component={Swap} />
                <Route
                  exact
                  strict
                  path='/swap/:outputCurrency'
                  component={RedirectToSwap}
                />
                <Route
                  exact
                  strict
                  path='/send'
                  component={RedirectPathToSwapOnly}
                />
                <Route exact strict path='/find' component={PoolFinder} />
                <Route exact strict path='/pool' component={Pool} />
                <Route
                  exact
                  strict
                  path='/pool/:tokenId/:pairId'
                  component={PoolDetail}
                />
                <Route
                  exact
                  strict
                  path='/create'
                  component={RedirectToAddLiquidity}
                />
                <Route exact strict path='/yield' component={Yield} />
                <Route exact strict path='/poker/:pairId' component={Poker} />
                <Route
                  exact
                  strict
                  path='/stake/:type/:pairId'
                  component={Stake}
                />
                <Route
                  exact
                  strict
                  path='/unstake/:type/:pairId'
                  component={UnStake}
                />

                <Route exact strict path='/xmoon' component={TestComponent} />
                <Route
                  exact
                  strict
                  path='/marketpalce'
                  component={TestComponent}
                />
                <Route
                  exact
                  strict
                  path='/launchpad'
                  component={TestComponent}
                />
                <Route exact strict path='/xnova' component={TestComponent} />
                <Route exact path='/add' component={AddLiquidity} />
                <Route
                  exact
                  path='/add/:currencyIdA'
                  component={RedirectOldAddLiquidityPathStructure}
                />
                <Route
                  exact
                  path='/add/:currencyIdA/:currencyIdB'
                  component={RedirectDuplicateTokenIds}
                />
                <Route
                  exact
                  strict
                  path='/remove/:tokens'
                  component={RedirectOldRemoveLiquidityPathStructure}
                />
                <Route
                  exact
                  strict
                  path='/remove/:currencyIdA/:currencyIdB'
                  component={RemoveLiquidity}
                />
                <Route component={RedirectPathToSwapOnly} />
              </Switch>
            </Web3ReactManager>
            <Marginer />
          </BodyWrapper>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  )
}
