import React, { useCallback } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'

import {
  PageWrapper,
  HoverText,
  ResponsiveRow,
  GridRow,
  BaseInfoItem,
  PowerInfoDivider,
  PowerRow,
  PowerCard,
  PokerImage,
  Separator,
  ResponsiveButtonPrimary,
  ResponsiveButtonSecondary,
  RowCenterSmallLeft
} from './styleds'
import Poker1Img from '@/assets/images/poker1.svg'
import Poker5Img from '@/assets/images/poker5.svg'
import { DarkCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import Question from '@/components/QuestionHelper'
import { RowFixed, RowBetween, RowEnd } from '@/components/Row'
import { useActiveWeb3React } from '@/hooks'
import { useXKeyDaoContract } from '@/hooks/useContract'
import {
  useMiningPool,
  useMiningPoolData,
  usePowerRewardByAccount
} from '@/hooks/useMining'
import { useTransactionAdder } from '@/state/transactions/hooks'
import { TYPE } from '@/theme'
import { calculateGasMargin } from '@/utils'

export default function Poker({
  match: {
    params: { pairId }
  }
}: RouteComponentProps<{ pairId?: string }>) {
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
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
          }).then((response) => {
            addTransaction(response, {
              summary: `Harvest ${rewardByAccount} XKEY`
            })
          })
        })
      }
    }
  }, [account, pairId, rewardByAccount])

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
                    <RowCenterSmallLeft>
                      <TYPE.largeHeader
                        fontSize='1.25rem'
                        margin='0 0 0.5rem'
                        fontWeight='bold'>
                        {item.value}
                      </TYPE.largeHeader>
                    </RowCenterSmallLeft>
                    <RowCenterSmallLeft>
                      <TYPE.darkGray fontSize='0.5rem'>
                        {item.key}
                      </TYPE.darkGray>
                    </RowCenterSmallLeft>
                  </BaseInfoItem>
                ))}
              </ResponsiveRow>
              <PowerInfoDivider />
              <ResponsiveRow>
                {pokerPower.map((item) => (
                  <BaseInfoItem justify='center' key={item.key}>
                    <RowCenterSmallLeft>
                      <TYPE.largeHeader
                        fontSize='1.25rem'
                        margin='0 0 0.5rem'
                        fontWeight='bold'>
                        {item.value}
                      </TYPE.largeHeader>
                    </RowCenterSmallLeft>
                    <RowCenterSmallLeft>
                      <TYPE.darkGray fontSize='0.5rem'>
                        {item.key}
                      </TYPE.darkGray>
                    </RowCenterSmallLeft>
                  </BaseInfoItem>
                ))}
              </ResponsiveRow>
            </DarkCard>

            <ResponsiveRow>
              <DarkCard>
                <PowerRow>
                  <PowerCard>
                    <RowCenterSmallLeft>
                      <TYPE.mediumHeader
                        textAlign='center'
                        fontSize='16px'
                        fontWeight={500}>
                        My Mining Power
                      </TYPE.mediumHeader>
                    </RowCenterSmallLeft>
                    <RowCenterSmallLeft>
                      <TYPE.mediumHeader
                        textAlign='center'
                        fontSize='26px'
                        margin='1rem 0'
                        fontWeight='bold'>
                        {powerByAccount}
                      </TYPE.mediumHeader>
                    </RowCenterSmallLeft>
                    <RowCenterSmallLeft>
                      <ResponsiveButtonPrimary
                        as={Link}
                        to={`/unstake/SINGLE/${pairId}`}>
                        Staked xPoker
                      </ResponsiveButtonPrimary>
                    </RowCenterSmallLeft>
                  </PowerCard>
                  <Separator />
                  <PowerCard>
                    <RowCenterSmallLeft>
                      <TYPE.mediumHeader
                        textAlign='center'
                        fontSize='16px'
                        fontWeight={500}>
                        My Reward
                      </TYPE.mediumHeader>
                    </RowCenterSmallLeft>
                    <RowCenterSmallLeft>
                      <TYPE.mediumHeader
                        textAlign='center'
                        fontSize='26px'
                        margin='1rem 0'
                        fontWeight='bold'>
                        {rewardByAccount}
                      </TYPE.mediumHeader>
                    </RowCenterSmallLeft>
                    <RowCenterSmallLeft>
                      <ResponsiveButtonPrimary onClick={harvest}>
                        Harvest
                      </ResponsiveButtonPrimary>
                    </RowCenterSmallLeft>
                  </PowerCard>
                </PowerRow>
              </DarkCard>
            </ResponsiveRow>

            <GridRow>
              <DarkCard>
                <PowerCard>
                  <PokerImage>
                    <img src={Poker1Img} alt={'poker img'} />
                  </PokerImage>
                  <TYPE.mediumHeader textAlign='center' margin='1rem 0'>
                    Single Poker Mining
                  </TYPE.mediumHeader>
                  <RowBetween margin='1rem 0'>
                    <ResponsiveButtonSecondary
                      as={Link}
                      to={`/stake/SINGLE/${pairId}`}>
                      Stake
                    </ResponsiveButtonSecondary>
                    <ResponsiveButtonSecondary
                      as={Link}
                      to={`/unstake/SINGLE/${pairId}`}>
                      Unstake
                    </ResponsiveButtonSecondary>
                  </RowBetween>
                </PowerCard>
              </DarkCard>
              <DarkCard>
                <PowerCard>
                  <PokerImage>
                    <img src={Poker5Img} alt={'poker img'} />
                  </PokerImage>
                  <TYPE.mediumHeader textAlign='center' margin='1rem 0'>
                    Sythetic Poker Mining
                  </TYPE.mediumHeader>
                  <RowBetween margin='1rem 0'>
                    <ResponsiveButtonSecondary
                      as={Link}
                      to={`/stake/SYNTHETIC/${pairId}`}>
                      Stake
                    </ResponsiveButtonSecondary>
                    <ResponsiveButtonSecondary
                      as={Link}
                      to={`/unstake/SYNTHETIC/${pairId}`}>
                      Unstake
                    </ResponsiveButtonSecondary>
                  </RowBetween>
                </PowerCard>
              </DarkCard>
            </GridRow>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
