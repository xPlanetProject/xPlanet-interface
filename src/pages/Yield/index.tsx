import React, { useContext } from 'react'

import PoolList from './PoolList'
import { DarkCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import Question from '@/components/QuestionHelper'
import { AutoRow, RowBetween } from '@/components/Row'
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
    align-items: flex-start;
    flex-direction: column;
    row-gap: 16px;
  `};
`

const BaseInfoItem = styled(AutoColumn)`
  padding: 1.5rem 1.25rem;
  flex: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1rem 0.5rem;
    justify-items: flex-start;
  `};
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
              <TYPE.gray fontWeight='bold' fontSize='20px'>
                xPoker Mining
              </TYPE.gray>
            </TitleRow>
            <DarkCard>
              <ResponsiveRow>
                {poolInfo.map((item) => (
                  <BaseInfoItem justify='center' key={item.key}>
                    <TYPE.largeHeader
                      color={theme.text1}
                      fontSize='1.75rem'
                      margin='0 0 0.5rem'
                      fontWeight='bold'>
                      <CountUp
                        isCounting
                        thousandsSeparator=','
                        end={item.value}
                        duration={3.2}
                      />
                    </TYPE.largeHeader>
                    <TYPE.subHeader color={theme.text2} fontWeight={500}>
                      {item.key}
                    </TYPE.subHeader>
                  </BaseInfoItem>
                ))}
              </ResponsiveRow>
            </DarkCard>
            <AutoRow>
              <TYPE.gray fontWeight='bold' fontSize='20px'>
                Pool List
              </TYPE.gray>
              <Question text='xPoker Mining.' />
            </AutoRow>
            <PoolList />
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
