import React, { useContext, useCallback } from 'react'

import SingleStakeItem from './SingleStakeItem'
import { PokerItemType } from './StakeHelpers'
import { ButtonLight } from '@/components/Button'
import { LightCard } from '@/components/Card'
import { RowBetween } from '@/components/Row'
import { useActiveWeb3React } from '@/hooks'
import {
  useXKeyDaoContract,
  useNFTPositionManagerContract
} from '@/hooks/useContract'
import useTheme from '@/hooks/useTheme'
import { uesSingleMaps } from '@/hooks/useUnStake'
import { Dots } from '@/pages/Pool/styleds'
import { PageWrapper } from '@/pages/PoolDetail/styleds'
import { TYPE } from '@/theme'
import { calculateGasMargin } from '@/utils'
import { PokerType } from '@/utils/poker'
import styled from 'styled-components'

type PageProps = {
  pairId: string
}

const Row = styled.div`
  align-items: center;
  border-radius: 20px;
  display: flex;
  color: ${({ theme }) => theme.text1};
  margin: 8px 0;
  padding: 16px;
  text-decoration: none;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg1};

  & > div:not(:first-child) {
    text-align: center;
  }
  & > div:last-child {
    text-align: right;
  }
  :hover {
    background-color: ${({ theme }) => theme.bg2};
  }
`
const StakeCheckouSection = styled.div`
  flex: 1;
`

const UnStakeSingle: React.FC<PageProps> = ({ pairId }: PageProps) => {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const { pokers, loading } = uesSingleMaps(account, pairId)
  console.log(pokers)

  const xKeyDaoContract = useXKeyDaoContract()
  const positionManager = useNFTPositionManagerContract()

  const unStateSingle = useCallback(async () => {
    if (pokers.length) {
      const poker = pokers[0]

      const estimate = xKeyDaoContract?.estimateGas?.removeSwaptokenShareSingle
      const removeSwaptokenShareSingle =
        xKeyDaoContract?.removeSwaptokenShareSingle
      const address = xKeyDaoContract?.address
      const estimateApprove = positionManager?.approve
      const approve = positionManager?.approve

      const args = [poker.tokenId]
      const approveArgs = [address, poker.tokenId]

      if (estimateApprove && approve) {
        approve(...approveArgs, {}).then(() => {
          if (estimate && removeSwaptokenShareSingle) {
            estimate(...args, {}).then((estimatedGasLimit) => {
              removeSwaptokenShareSingle(...args, {
                gasLimit: calculateGasMargin(estimatedGasLimit)
              })
                .then((res) => {
                  console.log(res)
                })
                .catch((e) => {
                  console.log(e)
                })
            })
          }
        })
      }
    }
  }, [pokers, xKeyDaoContract, positionManager])

  const PokerList: PokerItemType[] = [
    {
      id: '1',
      pokerType: PokerType.GRASS,
      pokerNumber: 'A',
      amount: '100',
      miningPower: '500'
    },
    {
      id: '2',
      pokerType: PokerType.HEART,
      pokerNumber: 'K',
      amount: '100',
      miningPower: '500'
    },
    {
      id: '3',
      pokerType: PokerType.CUBE,
      pokerNumber: 'Q',
      amount: '100',
      miningPower: '500'
    },
    {
      id: '4',
      pokerType: PokerType.SPADES,
      pokerNumber: 'J',
      amount: '100',
      miningPower: '500'
    },
    {
      id: '5',
      pokerType: PokerType.GRASS,
      pokerNumber: '10',
      amount: '100',
      miningPower: '500'
    }
  ]

  if (loading) {
    return (
      <PageWrapper>
        <LightCard padding='40px'>
          <TYPE.body color={theme.text3} textAlign='center'>
            <Dots>Loading</Dots>
          </TYPE.body>
        </LightCard>
      </PageWrapper>
    )
  }

  return (
    <>
      <Row>
        <StakeCheckouSection>
          <TYPE.subHeader>ID</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>Poker</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>流动性份额</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>算力</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>操作</TYPE.subHeader>
        </StakeCheckouSection>
      </Row>
      {PokerList?.map((item) => {
        return <SingleStakeItem data={item} key={item.id} />
      })}
      <RowBetween style={{ marginTop: 20 }}>
        <TYPE.subHeader>Currently Selected: 5/20</TYPE.subHeader>
        <ButtonLight
          onClick={unStateSingle}
          style={{
            width: 'auto',
            padding: '0.4rem .6rem',
            borderRadius: '16px',
            fontSize: '12px'
          }}>
          UnStake
        </ButtonLight>
      </RowBetween>
    </>
  )
}

export default UnStakeSingle
