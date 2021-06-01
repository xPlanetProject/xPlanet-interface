import React, { useContext } from 'react'

import PoolList from './PoolList'
import { DarkCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import Question from '@/components/QuestionHelper'
import { RowBetween } from '@/components/Row'
import { useCurrentStagePrice, userSwapTokenHadMint } from '@/hooks/useMining'
import { TYPE } from '@/theme'
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

  const price = useCurrentStagePrice()
  const mint = userSwapTokenHadMint()

  const poolInfo: Array<any> = [
    { key: 'Value of staked LP (XKEY)', value: 999999999 },
    { key: 'Yielded (XKEY)', value: Number(mint) },
    { key: 'Rate (XKEY/Block)', value: Number(price) }
  ]

  return (
    <>
      <PageWrapper>
        <AutoColumn gap='lg' justify='center'>
          <AutoColumn gap='lg' style={{ width: '100%' }}>
            <TitleRow>
              <TYPE.mediumHeader>xPoker Mining</TYPE.mediumHeader>
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
            <RowBetween>
              <Text color={theme.text1} fontWeight={500}>
                Pool List
              </Text>
              <Question text='xPoker Mining.' />
            </RowBetween>
            <PoolList />
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
