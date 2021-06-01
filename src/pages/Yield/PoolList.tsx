import React from 'react'
import { Token, ChainId } from '@xplanet/sdk'

import PoolListItem from './PoolListItem'
import { AutoColumn } from '@/components/Column'
import { RowAround } from '@/components/Row'
import styled from 'styled-components'

const ColumnGrid = styled(RowAround)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`

interface PoolPair {
  id: string
  token0: Token
  token1: Token
}

const poolList: Array<PoolPair> = [
  {
    id: 'XKEY-USDT',
    token0: new Token(
      ChainId.MAINNET,
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      18,
      'XKEY'
    ),
    token1: new Token(
      ChainId.MAINNET,
      '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      18,
      'USDT'
    )
  },
  {
    id: 'XKEY-ETH',
    token0: new Token(
      ChainId.MAINNET,
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      18,
      'XKEY'
    ),
    token1: new Token(
      ChainId.MAINNET,
      '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      18,
      'ETH'
    )
  }
]

export default function PoolList() {
  return (
    <>
      <ColumnGrid>
        {poolList.map((item) => (
          <PoolListItem
            id={item.id}
            token0={item.token0}
            token1={item.token1}
            key={item.id}
          />
        ))}
      </ColumnGrid>
    </>
  )
}
