import React from 'react'

import SingleStakeItem from './single-stake-item'
import { PokerItemType } from './stake-helpers'
import { ButtonLight } from '@/components/Button'
import { RowBetween } from '@/components/Row'
import { TYPE } from '@/theme'
import { PokerType } from '@/utils/poker'
import styled from 'styled-components'

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

const SingleStake: React.FC = () => {
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
          style={{
            width: 'auto',
            padding: '0.4rem .6rem',
            borderRadius: '16px',
            fontSize: '12px'
          }}>
          Stake
        </ButtonLight>
      </RowBetween>
    </>
  )
}

export default SingleStake
