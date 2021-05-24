import React, { useContext } from 'react'

import {
  ResponsiveRow,
  PowerInfoDivider,
  PowerCard,
  PokerImage,
  StakeLink
} from './styleds'
import PokerImg from '@/assets/images/poker.jpeg'
import { ButtonOutlined } from '@/components/Button'
import { DarkCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import Question from '@/components/QuestionHelper'
import { RowBetween, RowAround, RowEnd } from '@/components/Row'
import { HideSmall, TYPE } from '@/theme'
import styled, { ThemeContext } from 'styled-components'

export type PokerType = {
  key: string
  value: string
}

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

const BaseInfoItem = styled(AutoColumn)`
  flex: 1;
`

export default function Poker() {
  const theme = useContext(ThemeContext)
  console.log(theme)

  const pokerInfo: Array<any> = [
    { key: 'Staked Amount', value: '1,000 xPoker' },
    { key: 'Synthetic Asset Amount', value: '100 xPoker' },
    { key: 'Total Mining Power', value: '5,000' }
  ]

  const pokerPower: Array<any> = [
    { key: 'Yielded', value: '5,000 XKEY' },
    { key: 'Yield Rate per block', value: '162/Block' },
    { key: 'APY for 1 Unt of Mining Power', value: '207%' }
  ]
  return (
    <>
      <PageWrapper>
        <AutoColumn gap='lg' justify='center'>
          <AutoColumn gap='lg' style={{ width: '100%' }}>
            <TitleRow>
              <HideSmall>
                <TYPE.mediumHeader>PokerMine</TYPE.mediumHeader>
              </HideSmall>
            </TitleRow>

            <DarkCard>
              <RowEnd>
                <Question text='Question for Pokermine...' />
              </RowEnd>
              <ResponsiveRow>
                {pokerInfo.map((item) => (
                  <BaseInfoItem justify='center' key={item.key}>
                    <TYPE.largeHeader
                      fontSize='1.5rem'
                      margin='0 0 0.5rem'
                      fontWeight={500}>
                      {item.value}
                    </TYPE.largeHeader>
                    <TYPE.subHeader>{item.key}</TYPE.subHeader>
                  </BaseInfoItem>
                ))}
              </ResponsiveRow>
              <PowerInfoDivider />
              <ResponsiveRow>
                {pokerPower.map((item) => (
                  <BaseInfoItem justify='center' key={item.key}>
                    <TYPE.largeHeader
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

            <ResponsiveRow>
              <PowerCard>
                <DarkCard>
                  <TYPE.mediumHeader textAlign='center'>
                    My Mining Power
                  </TYPE.mediumHeader>
                  <TYPE.mediumHeader textAlign='center' marginTop='20px'>
                    100
                  </TYPE.mediumHeader>
                  <StakeLink to='/unstake'>
                    <ButtonOutlined
                      style={{
                        width: 'auto',
                        padding: '0.4rem .6rem',
                        borderRadius: '16px',
                        fontSize: '12px',
                        margin: '20px auto 0'
                      }}>
                      Staked xPoker
                    </ButtonOutlined>
                  </StakeLink>
                </DarkCard>
              </PowerCard>
              <PowerCard>
                <DarkCard>
                  <TYPE.mediumHeader textAlign='center'>
                    My Reward
                  </TYPE.mediumHeader>
                  <TYPE.mediumHeader textAlign='center' marginTop='20px'>
                    100
                  </TYPE.mediumHeader>
                  <ButtonOutlined
                    style={{
                      width: 'auto',
                      padding: '0.4rem .6rem',
                      borderRadius: '16px',
                      fontSize: '12px',
                      margin: '20px auto 0'
                    }}>
                    Harvest
                  </ButtonOutlined>
                </DarkCard>
              </PowerCard>
            </ResponsiveRow>

            <ResponsiveRow>
              <PowerCard>
                <DarkCard>
                  <TYPE.mediumHeader textAlign='center'>
                    Single Poker Mining
                  </TYPE.mediumHeader>
                  <PokerImage>
                    <img src={PokerImg} alt={'poker img'} />
                  </PokerImage>

                  <RowAround>
                    <StakeLink to='/stake'>
                      <ButtonOutlined
                        style={{
                          width: 'auto',
                          padding: '0.4rem .6rem',
                          borderRadius: '16px',
                          fontSize: '12px',
                          margin: '20px auto 0'
                        }}>
                        Stake
                      </ButtonOutlined>
                    </StakeLink>

                    <StakeLink to='/unstake'>
                      <ButtonOutlined
                        style={{
                          width: 'auto',
                          padding: '0.4rem .6rem',
                          borderRadius: '16px',
                          fontSize: '12px',
                          margin: '20px auto 0'
                        }}>
                        Unstake
                      </ButtonOutlined>
                    </StakeLink>
                  </RowAround>
                </DarkCard>
              </PowerCard>
              <PowerCard>
                <DarkCard>
                  <TYPE.mediumHeader textAlign='center'>
                    Sythetic Poker Mining
                  </TYPE.mediumHeader>
                  <PokerImage>
                    <img src={PokerImg} alt={'poker img'} />
                  </PokerImage>
                  <RowAround>
                    <StakeLink to='/stake'>
                      <ButtonOutlined
                        style={{
                          width: 'auto',
                          padding: '0.4rem .6rem',
                          borderRadius: '16px',
                          fontSize: '12px',
                          margin: '20px auto 0'
                        }}>
                        Stake
                      </ButtonOutlined>
                    </StakeLink>

                    <StakeLink to='/unstake'>
                      <ButtonOutlined
                        style={{
                          width: 'auto',
                          padding: '0.4rem .6rem',
                          borderRadius: '16px',
                          fontSize: '12px',
                          margin: '20px auto 0'
                        }}>
                        Unstake
                      </ButtonOutlined>
                    </StakeLink>
                  </RowAround>
                </DarkCard>
              </PowerCard>
            </ResponsiveRow>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
