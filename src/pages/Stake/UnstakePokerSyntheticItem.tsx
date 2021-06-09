import React, { useState } from 'react'

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

const StyledDropDown = styled(DropDown)<{ open: boolean }>`
  margin: 0 1rem 0 0.5rem;
  height: 35%;
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'none')};
  path {
    stroke: ${({ open, theme }) => (open ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const SyntheticWrapper = styled.div<{ active: boolean }>`
  overflow: hidden;
  height: ${({ active }) => (active ? 'auto' : '0')};
`

interface ISingleStakeItemProps {
  data: any
  checked?: boolean
  handleClick?: (id: string) => void
}

const SingleStakeItem: React.FC<any> = ({
  data,
  checked,
  selected,
  selectPoker
}) => {
  const [open, setOpen] = useState(false)
  return (
    <Wrapper>
      <Row onClick={() => setOpen(!open)}>
        <StakeCheckouSection>
          <TYPE.subHeader>{data?.index}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>{data?.combineType}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>{data?.combineLPAmount}</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>{data?.combinePower}</TYPE.subHeader>
        </StakeCheckouSection>
        <DropDownWrapper>
          <StyledDropDown open={open} />
          <input
            type='checkbox'
            checked={selected.includes(data.index)}
            onClick={(e) => e.stopPropagation()}
            onChange={() => {
              selectPoker(data.index)
            }}
            style={{ width: 18, height: 18 }}
          />
        </DropDownWrapper>
      </Row>
      <SyntheticWrapper active={open}>
        <RowPoker>
          <RowPokerSection>
            <TYPE.subHeader>ID</TYPE.subHeader>
          </RowPokerSection>
          <RowPokerSection>
            <TYPE.subHeader>xPoker</TYPE.subHeader>
          </RowPokerSection>
        </RowPoker>
        {data?.pokers?.map((item, index) => {
          return (
            <RowPoker key={item.tokenIdStr}>
              <RowPokerSection>
                <TYPE.subHeader>{item.tokenIdStr}</TYPE.subHeader>
              </RowPokerSection>
              <RowPokerSection>
                <TYPE.subHeader>{`${item?.pokerInfo.faceIcon} ${item?.pokerInfo.rank}`}</TYPE.subHeader>
              </RowPokerSection>
            </RowPoker>
          )
        })}
      </SyntheticWrapper>
    </Wrapper>
  )
}

export default SingleStakeItem
