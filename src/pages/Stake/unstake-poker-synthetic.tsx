import React, { useContext } from 'react'

import SingleStakeItem from './single-stake-item'
import { PokerItemType } from './stake-helpers'
import { ButtonLight } from '@/components/Button'
import { RowBetween } from '@/components/Row'
import { TYPE } from '@/theme'
import { PokerType } from '@/utils/poker'
import styled, { ThemeContext } from 'styled-components'

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

const PokerItem = styled.div`
  flex: 1;
  border-radius: 8px;
  padding: 24px;
  margin: 0 10px;
  background-color: ${({ theme }) => theme.bg2};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 180px;
  :hover {
    background-color: ${({ theme }) => theme.bg3};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-height: 100px;
    padding: 12px;
    margin: 0 4px;
  `};
`

const PokerResult = styled.div`
  text-align: center;
  margin: 20px 0;
`

const SyntheticStake: React.FC = () => {
  const theme = useContext(ThemeContext)

  const AllPokers: PokerItemType[] = [
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

  const PokerList: PokerItemType[] = [
    {
      id: '1',
      pokerType: PokerType.GRASS,
      pokerNumber: 'A'
    },
    {
      id: '2',
      pokerType: PokerType.HEART,
      pokerNumber: 'K'
    },
    {
      id: '3',
      pokerType: PokerType.CUBE,
      pokerNumber: 'Q'
    },
    {
      id: '4',
      pokerType: PokerType.SPADES,
      pokerNumber: 'J'
    }
  ]
  return (
    <>
      <RowBetween>
        <PokerItem>
          {PokerList[0] &&
            `${PokerList[0].pokerType} ${PokerList[0].pokerNumber}`}
        </PokerItem>
        <PokerItem>
          {PokerList[1] &&
            `${PokerList[1].pokerType} ${PokerList[1].pokerNumber}`}
        </PokerItem>
        <PokerItem>
          {PokerList[2] &&
            `${PokerList[2].pokerType} ${PokerList[2].pokerNumber}`}
        </PokerItem>
        <PokerItem>
          {PokerList[3] &&
            `${PokerList[3].pokerType} ${PokerList[3].pokerNumber}`}
        </PokerItem>
        <PokerItem>
          {PokerList[4] &&
            `${PokerList[4].pokerType} ${PokerList[5].pokerNumber}`}
        </PokerItem>
      </RowBetween>
      <PokerResult>
        <TYPE.subHeader>牌型：黑桃 A 算力：5000 总份额：50000</TYPE.subHeader>
      </PokerResult>
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
      {AllPokers?.map((item) => {
        return <SingleStakeItem data={item} key={item.id} />
      })}
      <RowBetween style={{ marginTop: 20 }}>
        <TYPE.subHeader>Currently Selected: 4/20</TYPE.subHeader>
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

export default SyntheticStake
