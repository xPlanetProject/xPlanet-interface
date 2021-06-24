import React from 'react'

import { PokerItemType } from './StakeHelpers'
import { Row, Column } from './styleds'
import { useLiquidityPower } from '@/hooks/useStake'
import { TYPE } from '@/theme'

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
          <TYPE.main fontWeight='bold'>
            {Number.parseFloat(liquidity).toFixed(4)}
          </TYPE.main>
        </Column>
        <Column flex='1'>
          <TYPE.main fontWeight='bold'>
            {Number(data.pokerInfo.rank * (liquidity ?? 1)).toFixed(4)}
          </TYPE.main>
        </Column>
      </Row>
    </>
  )
}

export default SingleStakeItem
