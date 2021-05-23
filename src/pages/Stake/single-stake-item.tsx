import React from 'react'

import { PokerItemType } from './stake-helpers'
import { TYPE } from '@/theme'
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

interface ISingleStakeItemProps {
  data: PokerItemType
  checked?: boolean
  handleClick?: (id: string) => void
}

const SingleStakeItem: React.FC<ISingleStakeItemProps> = ({
  data,
  checked
}) => {
  return (
    <>
      <Row>
        <StakeCheckouSection>
          <TYPE.subHeader>{data?.id}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>{`${data?.pokerType} ${data?.pokerNumber}`}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>{data?.amount}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>{data?.miningPower}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <input
            type='checkbox'
            checked={checked}
            onChange={() => {
              console.log(data?.id)
            }}
            style={{ width: 18, height: 18 }}
          />
        </StakeCheckouSection>
      </Row>
    </>
  )
}

export default SingleStakeItem
