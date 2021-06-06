import React, { useContext } from 'react'

import { PokerGroupType } from './StakeHelpers'
import UnStakePokerSyntheticItem from './UnstakePokerSyntheticItem'
import { ButtonLight } from '@/components/Button'
import { RowBetween } from '@/components/Row'
import { TYPE } from '@/theme'
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
  & > div:first-child {
    max-width: 80px;
  }
  & > div:not(:first-child) {
    text-align: center;
  }
  :hover {
    background-color: ${({ theme }) => theme.bg2};
  }
`
const StakeCheckouSection = styled.div`
  flex: 1;
`
const DropDownWrapper = styled.div`
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const SyntheticStake: React.FC = () => {
  const theme = useContext(ThemeContext)
  const AllPokers: PokerGroupType[] = [
    {
      id: '1',
      group: '同花顺',
      amount: '100',
      miningPower: '500'
    },
    {
      id: '2',
      group: '同花顺',
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
          <TYPE.subHeader>组合牌型</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>流动性总份额</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>算力</TYPE.subHeader>
        </StakeCheckouSection>
        <DropDownWrapper>
          <TYPE.subHeader>操作</TYPE.subHeader>
        </DropDownWrapper>
      </Row>
      {AllPokers?.map((item) => {
        return <UnStakePokerSyntheticItem data={item} key={item.id} />
      })}
      <RowBetween style={{ marginTop: 20 }}>
        <TYPE.subHeader>Currently Selected: 1/20</TYPE.subHeader>
        <ButtonLight
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

export default SyntheticStake
