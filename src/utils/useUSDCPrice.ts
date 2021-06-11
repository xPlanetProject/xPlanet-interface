// import {
//   ChainId,
//   Currency,
//   currencyEquals,
//   JSBI,
//   Price,
//   WETH,
//   Token
// } from '@xplanet/sdk'

import { useMemo } from 'react'

import { USDC } from '@/constants'
import { PairState, useUniPairs } from '@/data/useUniswapPair'
import { useActiveWeb3React } from '@/hooks'
import { wrappedCurrency } from './wrappedCurrency'

import {
  ChainId,
  Currency,
  currencyEquals,
  JSBI,
  Price,
  WETH,
  Token
} from '@xplanet/sdk'

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        // chainId && wrapped && currencyEquals(WETH[chainId], wrapped)
        //   ? undefined
        //   : currency,
        currency,
        chainId ? WETH[chainId] : undefined
      ],
      [
        wrapped?.equals(USDC) ? undefined : wrapped,
        chainId === ChainId.MAINNET ? USDC : undefined
      ],
      [
        chainId ? WETH[chainId] : undefined,
        chainId === ChainId.MAINNET ? USDC : undefined
      ]
    ],
    [chainId, currency, wrapped]
  )

  const [
    [ethPairState, ethPair],
    [usdcPairState, usdcPair],
    [usdcEthPairState, usdcEthPair]
  ] = useUniPairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle weth/eth
    if (wrapped.equals(WETH[chainId])) {
      if (usdcPair) {
        const price = usdcPair.priceOf(WETH[chainId])
        return new Price(currency, USDC, price.denominator, price.numerator)
      } else {
        return undefined
      }
    }
    // handle usdc
    if (wrapped.equals(USDC)) {
      return new Price(USDC, USDC, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WETH[chainId])
    const ethPairETHUSDCValue: JSBI =
      ethPairETHAmount && usdcEthPair
        ? usdcEthPair.priceOf(WETH[chainId]).quote(ethPairETHAmount).raw
        : JSBI.BigInt(0)

    // all other tokens
    // first try the usdc pair
    if (
      usdcPairState === PairState.EXISTS &&
      usdcPair &&
      usdcPair.reserveOf(USDC).greaterThan(ethPairETHUSDCValue)
    ) {
      const price = usdcPair.priceOf(wrapped)
      return new Price(currency, USDC, price.denominator, price.numerator)
    }
    if (
      ethPairState === PairState.EXISTS &&
      ethPair &&
      usdcEthPairState === PairState.EXISTS &&
      usdcEthPair
    ) {
      if (
        usdcEthPair.reserveOf(USDC).greaterThan('0') &&
        ethPair.reserveOf(WETH[chainId]).greaterThan('0')
      ) {
        const ethUsdcPrice = usdcEthPair.priceOf(USDC)
        const currencyEthPrice = ethPair.priceOf(WETH[chainId])
        const usdcPrice = ethUsdcPrice.multiply(currencyEthPrice).invert()
        return new Price(
          currency,
          USDC,
          usdcPrice.denominator,
          usdcPrice.numerator
        )
      }
    }

    if (chainId !== ChainId.MAINNET && currency) {
      const FAKE_USDC = new Token(ChainId.ROPSTEN, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'fUSDC', 'Fake USDC')
      return new Price(
        currency,
        FAKE_USDC,
        JSBI.BigInt(10 ** Math.max(0, currency.decimals - 6)),
        JSBI.BigInt(15 * 10 ** Math.max(6 - currency.decimals, 0))
      )
    }

    return undefined
  }, [
    chainId,
    currency,
    ethPair,
    ethPairState,
    usdcEthPair,
    usdcEthPairState,
    usdcPair,
    usdcPairState,
    wrapped
  ])
}
