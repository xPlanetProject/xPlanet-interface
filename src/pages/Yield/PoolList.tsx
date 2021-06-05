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
              pairId={item.pairId}
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
