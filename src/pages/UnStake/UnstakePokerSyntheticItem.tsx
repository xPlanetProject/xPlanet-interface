import React, { useState } from 'react'

import { ReactComponent as DropDown } from '@/assets/images/dropdown.svg'
import { WrapperRow, Column } from '@/pages/Stake/styleds'
import { TYPE } from '@/theme'
import { Box } from 'rebass/styled-components'
import styled from 'styled-components'

const Wrapper = styled(Box)`
  border-radius: 20px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.bg1};

  :hover {
    background-color: ${({ theme }) => theme.bg2};
  }
`

const DropDownWrapper = styled(Column)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const StyledDropDown = styled(DropDown)<{ open: boolean }>`
  margin: 0 0.5rem;
  height: 35%;
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'none')};
  path {
    stroke: ${({ theme }) => theme.text1};
    stroke-width: 1.5px;
  }
`

const SyntheticWrapper = styled.div<{ active: boolean }>`
  overflow: hidden;
  height: ${({ active }) => (active ? 'auto' : '0')};
`

const SingleStakeItem: React.FC<any> = ({
  data,
  checked,
  selected,
  selectPoker
}) => {
  const [open, setOpen] = useState(false)
  return (
    <Wrapper>
      <WrapperRow onClick={() => setOpen(!open)}>
        <DropDownWrapper width='80px'>
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
        <Column width='160px'>
          <TYPE.body>{data.combineType || 'Royal Flush'}</TYPE.body>
        </Column>
        <Column>
          <TYPE.body>-</TYPE.body>
        </Column>
        <Column flex='1'>
          <TYPE.body>{data.combineLPAmount}</TYPE.body>
        </Column>
        <Column flex='1'>
          <TYPE.body>{data.combinePower}</TYPE.body>
        </Column>
      </WrapperRow>

      <SyntheticWrapper active={open}>
        {data.pokers.map((item, index) => {
          return (
            <WrapperRow key={item.tokenIdStr || index}>
              <Column width='80px'></Column>
              <Column width='160px'>
                <TYPE.body>{`${item.pokerInfo.faceIcon} ${item.pokerInfo.face}`}</TYPE.body>
              </Column>
              <Column>
                <TYPE.body>{item.tokenIdStr}</TYPE.body>
              </Column>
              <Column flex='1'>
                <TYPE.body>{item.combineLPAmount}</TYPE.body>
              </Column>
              <Column flex='1'>
                <TYPE.body>{item.combinePower}</TYPE.body>
              </Column>
            </WrapperRow>
          )
        })}
      </SyntheticWrapper>
    </Wrapper>
  )
}

export default SingleStakeItem
