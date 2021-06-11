import React, { useCallback } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'

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
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import Question from '@/components/QuestionHelper'
import { RowFixed, RowBetween, RowAround, RowEnd } from '@/components/Row'
import { useActiveWeb3React } from '@/hooks'
import { useXKeyDaoContract } from '@/hooks/useContract'
import {
  useMiningPool,
  useMiningPoolData,
  usePowerRewardByAccount
} from '@/hooks/useMining'
import { TYPE } from '@/theme'
import { calculateGasMargin } from '@/utils'
import styled from 'styled-components'

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

const HoverText = styled(TYPE.main)`
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  :hover {
    color: ${({ theme }) => theme.text1};
    text-decoration: none;
  }
`

const BaseInfoItem = styled(AutoColumn)`
  flex: 1;
`

export default function Poker({
  match: {
    params: { pairId }
  }
}: RouteComponentProps<{ pairId?: string }>) {
  const { account } = useActiveWeb3React()
  const xKeyDaoContract = useXKeyDaoContract()

  const poolInfo = useMiningPool(pairId)
  const {
    singleLength = '0',
    compositeLength = '0',
    powerAmount = '0',
    hadMintAmount = '0',
    yieldRate = '0',
    APR = '0'
  } = useMiningPoolData(pairId) ?? {}
  const { powerByAccount, rewardByAccount } =
    usePowerRewardByAccount(pairId, account) ?? {}

  const pokerInfo: Array<any> = [
    { key: 'Staked Amount (xPoker)', value: `${singleLength}` },
    { key: 'Synthetic Asset Amount (xPoker)', value: `${compositeLength}` },
    { key: 'Total Mining Power', value: powerAmount }
  ]

  const pokerPower: Array<any> = [
    { key: 'Yielded (XKEY)', value: `${hadMintAmount}` },
    { key: 'Yield Rate per block', value: `${yieldRate}/Block` },
    { key: 'APR for 1 Unt of Mining Power', value: `${APR}%` }
  ]

  const harvest = useCallback(async () => {
    if (account && pairId) {
      let args = [pairId]
      let estimate = xKeyDaoContract?.estimateGas?.getSwaptokenReward
      let method = xKeyDaoContract?.getSwaptokenReward

      if (estimate && method) {
        estimate(...args, {}).then((estimatedGasLimit) => {
          method(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
        })
      }
    }
  }, [account, pairId])

  return (
    <>
      <PageWrapper>
        <AutoColumn gap='lg' justify='center'>
          <AutoColumn gap='lg' style={{ width: '100%' }}>
            <Link
              style={{
                textDecoration: 'none',
                width: 'fit-content',
                marginBottom: '0.5rem'
              }}
              to='/yield'>
              <HoverText>{'← Back to xPoker Mining'}</HoverText>
            </Link>
            <RowFixed>
              <DoubleCurrencyLogo
                currency0={poolInfo?.token0}
                currency1={poolInfo?.token1}
                size={24}
                margin={true}
              />
              <TYPE.label fontSize={'24px'} mr='10px'>
                &nbsp;{poolInfo?.token0?.symbol}&nbsp;/&nbsp;
                {poolInfo?.token1?.symbol}
              </TYPE.label>
            </RowFixed>
          </AutoColumn>

          <AutoColumn gap='lg' style={{ width: '100%' }}>
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
                    {powerByAccount}
                  </TYPE.mediumHeader>
                  <StakeLink to={`/unstake/SINGLE/${pairId}`}>
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
                    {rewardByAccount}
                  </TYPE.mediumHeader>
                  <ButtonOutlined
                    onClick={harvest}
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
                    <StakeLink to={`/stake/SINGLE/${pairId}`}>
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

                    <StakeLink to={`/unstake/SINGLE/${pairId}`}>
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
                    <StakeLink to={`/stake/SYNTHETIC/${pairId}`}>
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

                    <StakeLink to={`/unstake/SYNTHETIC/${pairId}`}>
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
