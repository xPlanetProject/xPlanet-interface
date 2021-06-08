import React from 'react'

import { PokerItemType } from './StakeHelpers'
import { TYPE } from '@/theme'
import { useLiquidityPower } from '@/hooks/useStake'
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

const SingleStakeItem: React.FC<any> = ({
  data,
  checked,
  selectIds,
  selectPoker
}) => {

  const { liquidity } = useLiquidityPower(data.pairId, data.tokenIdStr)

  return (
    <>
      <Row>
        <StakeCheckouSection>
          <TYPE.subHeader>{data.tokenIdStr}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>{`${data.pokerInfo.faceIcon} ${data.pokerInfo.face}`}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>{liquidity}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>{data.pokerInfo.rank * (liquidity ?? 1)}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <input
            type='checkbox'
            checked={selectIds.includes(data.tokenIdStr)}
            onChange={() => {
              selectPoker(data.tokenIdStr)
            }}
            style={{ width: 18, height: 18 }}
          />
        </StakeCheckouSection>
      </Row>
    </>
  )
}

export default SingleStakeItem
