import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import PoolListItem from './PoolListItem'
import { LightCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import { Dots } from '@/components/swap/styleds'
import { useMiningList } from '@/hooks/useMining'
import { TYPE } from '@/theme'
import styled, { ThemeContext } from 'styled-components'

const ColumnGrid = styled(AutoColumn)`
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 24px;
  grid-column-gap: 24px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr;
  `};
`

function PoolList() {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const { loading, pairIds } = useMiningList()

  return (
    <>
      {loading ? (
        <LightCard padding='40px'>
          <TYPE.body color={theme.text3} textAlign='center'>
            <Dots>{t('Loading')}</Dots>
          </TYPE.body>
        </LightCard>
      ) : pairIds.length > 0 ? (
        <ColumnGrid gap='lg'>
          {pairIds.map((item) => (
            <PoolListItem pairId={item.id} key={item.id} />
          ))}
        </ColumnGrid>
      ) : (
        <LightCard padding='40px'>
          <TYPE.body color={theme.text3} textAlign='center'>
            {t('No data')}
          </TYPE.body>
        </LightCard>
      )}
    </>
  )
}

export default React.memo(PoolList)
