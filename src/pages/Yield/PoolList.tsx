import React, { useContext } from 'react'

import PoolListItem from './PoolListItem'
import { LightCard } from '@/components/Card'
import { RowAround } from '@/components/Row'
import { useMiningList } from '@/hooks/useMining'
import { TYPE } from '@/theme'
import { Dots } from '@/components/swap/styleds'
import styled, { ThemeContext } from 'styled-components'

const ColumnGrid = styled(RowAround)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`

function PoolList() {
  const theme = useContext(ThemeContext)
  const { loading, pairIds } = useMiningList()

  return (
    <>
      {
        loading ?  (
          <LightCard padding='40px'>
            <TYPE.body color={theme.text3} textAlign='center'>
              <Dots>Loading</Dots>
            </TYPE.body>
          </LightCard>
        ) : 
        pairIds.length > 0 ? (
          <ColumnGrid>
            {pairIds.map((item) => (
              <PoolListItem
                pairId={item.id}
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
        )
      }
    </>
  )
}

export default React.memo(PoolList)
