import React, { useContext } from 'react'

import PoolListItem from './PoolListItem'
import { LightCard } from '@/components/Card'
import { RowAround } from '@/components/Row'
import { useMiningList } from '@/hooks/useMining'
import { TYPE } from '@/theme'
import { Token, ChainId } from '@xplanet/sdk'
import styled, { ThemeContext } from 'styled-components'

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

function PoolList() {
  const theme = useContext(ThemeContext)

  const pairMaps: any = useMiningList()
  console.log(pairMaps)

  return (
    <>
      {pairMaps?.length > 0 ? (
        <ColumnGrid>
          {pairMaps.map((item) => (
            <PoolListItem
              id={item.id}
              token0={item.token0}
              token1={item.token1}
              key={item.id}
            />
          ))}
        </ColumnGrid>
      ) : (
        <LightCard padding='40px'>
          <TYPE.body color={theme.text3} textAlign='center'>
            No data.
          </TYPE.body>
        </LightCard>
      )}
    </>
  )
}

export default React.memo(PoolList)
