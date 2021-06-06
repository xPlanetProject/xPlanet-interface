import React, { useState } from 'react'

import { PokerGroupType, PokerItemType } from './StakeHelpers'
import { ReactComponent as DropDown } from '@/assets/images/dropdown.svg'
import { TYPE } from '@/theme'
import { PokerType } from '@/utils/poker'
import styled from 'styled-components'

const Wrapper = styled.div`
  border-radius: 20px;
  background-color: ${({ theme }) => theme.bg1};

  :hover {
    background-color: ${({ theme }) => theme.bg2};
  }
`

const Row = styled.div`
  cursor: pointer;
  align-items: center;
  display: flex;
  color: ${({ theme }) => theme.text1};
  margin: 8px 0;
  padding: 16px;
  text-decoration: none;
  font-weight: 500;
  & > div:first-child {
    max-width: 80px;
  }
  & > div:not(:first-child) {
    text-align: center;
  }
`

const RowPoker = styled.div`
  align-items: center;
  display: flex;
  color: ${({ theme }) => theme.text1};
  margin: 8px 0;
  padding: 8px 16px;
  text-decoration: none;
  font-weight: 500;
  & > div:first-child {
    max-width: 80px;
    margin-left: 40px;
  }
  & > div:not(:first-child) {
    text-align: center;
  }
`

const RowPokerSection = styled.div`
  flex: 1;
  max-width: 200px;
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

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 1rem 0 0.5rem;
  height: 35%;
  transform: ${({ selected }) => (selected ? 'rotate(180deg)' : 'none')};
  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const SyntheticWrapper = styled.div<{ active: boolean }>`
  overflow: hidden;
  height: ${({ active }) => (active ? 'auto' : '0')};
`

interface ISingleStakeItemProps {
  data: PokerGroupType
  checked?: boolean
  handleClick?: (id: string) => void
}

const PokerList: PokerItemType[] = [
  {
    id: '',
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

const SingleStakeItem: React.FC<ISingleStakeItemProps> = ({
  data,
  checked
}) => {
  const [selected, setSelected] = useState(false)
  return (
    <Wrapper>
      <Row onClick={() => setSelected(!selected)}>
        <StakeCheckouSection>
          <TYPE.subHeader>{data?.id}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>{data?.group}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>{data?.amount}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>{data?.miningPower}</TYPE.subHeader>
        </StakeCheckouSection>
        <DropDownWrapper>
          <StyledDropDown selected={selected} />
          <input
            type='checkbox'
            checked={checked}
            onClick={e => e.stopPropagation()}
            onChange={() => {
              console.log(data?.id)
            }}
            style={{ width: 18, height: 18 }}
          />
        </DropDownWrapper>
      </Row>
      <SyntheticWrapper active={selected}>
        {PokerList?.map((item, index) => {
          return (
            <RowPoker key={item.id}>
              <RowPokerSection>
                <TYPE.subHeader>{index + 1}</TYPE.subHeader>
              </RowPokerSection>
              <RowPokerSection>
                <TYPE.subHeader>{`${item?.pokerType} ${item?.pokerNumber}`}</TYPE.subHeader>
              </RowPokerSection>
              <RowPokerSection>
                <TYPE.subHeader>{item?.amount}</TYPE.subHeader>
              </RowPokerSection>
            </RowPoker>
          )
        })}
      </SyntheticWrapper>
    </Wrapper>
  )
}

export default SingleStakeItem
