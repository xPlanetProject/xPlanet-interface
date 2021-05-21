import React, { useContext } from 'react'

import PoolList from './PoolList'
import { DarkCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import Question from '@/components/QuestionHelper'
import { RowBetween } from '@/components/Row'
import { HideSmall, TYPE } from '@/theme'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { CountUp } from 'use-count-up'

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

  const poolInfo: Array<any> = [
    { key: 'Value of staked LP (XKEY)', value: 999999999 },
    { key: 'Yield (XKEY)', value: 10000000 },
    { key: 'Rate (XKEY/Block)', value: 108 }
  ]

  return (
    <>
      <PageWrapper>
        <AutoColumn gap='lg' justify='center'>
          <AutoColumn gap='lg' style={{ width: '100%' }}>
            <TitleRow>
              <HideSmall>
                <TYPE.mediumHeader>xPoker Mining</TYPE.mediumHeader>
              </HideSmall>
            </TitleRow>
            <DarkCard>
              <ResponsiveRow>
                {poolInfo.map((item) => (
                  <BaseInfoItem justify='center' key={item.key}>
                    <TYPE.largeHeader
                      color={theme.text1}
                      fontSize='1.5rem'
                      margin='0 0 0.5rem'
                      fontWeight={500}>
                      <CountUp
                        isCounting
                        thousandsSeparator=','
                        end={item.value}
                        duration={3.2}
                      />
                    </TYPE.largeHeader>
                    <TYPE.subHeader color={theme.text3}>
                      {item.key}
                    </TYPE.subHeader>
                  </BaseInfoItem>
                ))}
              </ResponsiveRow>
            </DarkCard>
            <DarkCard>
              <RowBetween padding={'8px 8px 15px'}>
                <Text color={theme.text1} fontWeight={500}>
                  Pool List
                </Text>
                <Question text='When you add liquidity, you are given pool NFT that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.' />
              </RowBetween>
              <PoolList />
            </DarkCard>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
