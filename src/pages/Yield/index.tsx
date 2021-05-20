import React, { useContext } from 'react'

import styled, { ThemeContext } from 'styled-components'
import { HideSmall, TYPE } from '@/theme'

import { AutoColumn } from '@/components/Column'
import { RowBetween,  } from '@/components/Row'
import { DarkCard } from '@/components/Card'
import PoolList from './PoolList'

const PageWrapper = styled(AutoColumn)`
  max-width: 870px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 500px;
  `};
`

const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.text2};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ResponsiveRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    row-gap: 16px;
    width: 100%:
  `};
`

const BaseInfoItem = styled(AutoColumn)`
  flex: 1;
`

export default function Yield() {
  const theme = useContext(ThemeContext)
  console.log(theme)

  const poolInfo: Array<any> = [
    { key: 'Value of staked LP', value: '999,999,999 XKEY' },
    { key: 'Yield', value: '10,000,000 XKEY' },
    { key: 'Rate', value: '108 XKEY/Block' }
  ]

  return (
    <>
      <PageWrapper>
        <AutoColumn gap='lg' justify='center'>
          <AutoColumn gap='lg' style={{ width: '100%' }}>
            <TitleRow>
              <HideSmall>
                <TYPE.mediumHeader>xLP NFT Mining</TYPE.mediumHeader>
              </HideSmall>
            </TitleRow>

            <DarkCard>
              <ResponsiveRow>
                {poolInfo.map(item => (
                  <BaseInfoItem justify='center' key={item.key}>
                    <TYPE.largeHeader
                      color={theme.yellow3}
                      fontSize='1.5rem'
                      margin='0 0 0.5rem'
                      fontWeight={500}>
                      {item.value}
                    </TYPE.largeHeader>
                    <TYPE.subHeader>{item.key}</TYPE.subHeader>
                  </BaseInfoItem>
                ))}
              </ResponsiveRow>
            </DarkCard>
            <DarkCard>
              <PoolList />
            </DarkCard>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
