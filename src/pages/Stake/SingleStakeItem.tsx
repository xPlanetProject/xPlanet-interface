import React from 'react'

import { PokerItemType } from './StakeHelpers'
import { Row, Column } from './styleds'
import { TYPE } from '@/theme'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'

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
  const lp = Number(formatUnits(data.lp, 18)).toFixed(4)
  const power = Number(
    formatUnits(
      BigNumber.from(data.lp ?? 1).mul(data?.pokerInfo?.rank ?? 0),
      18
    )
  ).toFixed(4)

  return (
    <>
      <Row>
        <Column>
          <input
            type='checkbox'
            checked={selectIds.includes(data.tokenIdStr)}
            onChange={() => {
              selectPoker(data.tokenIdStr)
            }}
            style={{ width: 18, height: 18 }}
          />
        </Column>
        <Column>
          <TYPE.body fontWeight='bold'>{`${data.pokerInfo.faceIcon} ${data.pokerInfo.face}`}</TYPE.body>
        </Column>
        <Column>
          <TYPE.main fontWeight='bold'>{data.tokenIdStr}</TYPE.main>
        </Column>
        <Column flex='1'>
          <TYPE.main fontWeight='bold'>{lp}</TYPE.main>
        </Column>
        <Column flex='1'>
          <TYPE.main fontWeight='bold'>{power}</TYPE.main>
        </Column>
      </Row>
    </>
  )
}

export default SingleStakeItem
