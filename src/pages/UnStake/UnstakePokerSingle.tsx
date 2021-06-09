import React, { useState, useCallback } from 'react'

import { ButtonLight } from '@/components/Button'
import { LightCard } from '@/components/Card'
import { RowBetween } from '@/components/Row'
import { useActiveWeb3React } from '@/hooks'
import {
  useXKeyDaoContract,
  useNFTPositionManagerContract
} from '@/hooks/useContract'
import useTheme from '@/hooks/useTheme'
import { uesSingleMaps } from '@/hooks/useUnStake'
import { Dots } from '@/pages/Pool/styleds'
import { PageWrapper } from '@/pages/PoolDetail/styleds'
import SingleStakeItem from '@/pages/Stake/SingleStakeItem'
import { PokerItemType } from '@/pages/Stake/StakeHelpers'
import { TYPE } from '@/theme'
import { calculateGasMargin } from '@/utils'
import { PokerType } from '@/utils/poker'
import styled from 'styled-components'

type PageProps = {
  pairId: string
}

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

const UnStakeSingle: React.FC<PageProps> = ({ pairId }: PageProps) => {
  const theme = useTheme()
  const { account } = useActiveWeb3React()

  const [selectIds, selectPokerId] = useState<any>([])

  const { pokers, loading } = uesSingleMaps(account, pairId)

  const xKeyDaoContract = useXKeyDaoContract()
  const positionManager = useNFTPositionManagerContract()

  const unStateSingle = useCallback(async () => {
    if (selectIds.length) {
      const estimate = xKeyDaoContract?.estimateGas?.removeSwaptokenShareSingle
      const removeSwaptokenShareSingle =
        xKeyDaoContract?.removeSwaptokenShareSingle
      const args = selectIds

      if (estimate && removeSwaptokenShareSingle) {
        estimate(...args, {}).then((estimatedGasLimit) => {
          removeSwaptokenShareSingle(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
        })
      }
    }
  }, [selectIds, xKeyDaoContract, positionManager])

  const selectPoker = useCallback(
    (tokenId) => {
      selectPokerId((ids) => {
        if (ids.includes(tokenId)) {
          return ids.filter((id) => id !== tokenId)
        } else {
          return ids.concat([tokenId])
        }
      })
    },
    [selectIds]
  )

  if (loading) {
    return (
      <PageWrapper>
        <LightCard padding='40px'>
          <TYPE.body color={theme.text3} textAlign='center'>
            <Dots>Loading</Dots>
          </TYPE.body>
        </LightCard>
      </PageWrapper>
    )
  }

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
          <TYPE.subHeader>操作</TYPE.subHeader>
        </StakeCheckouSection>
      </Row>
      {pokers.length ? (
        pokers.map((item) => {
          return (
            <SingleStakeItem
              data={item}
              key={item.tokenIdStr}
              selectIds={selectIds}
              selectPoker={selectPoker}
            />
          )
        })
      ) : (
        <LightCard padding='40px'>
          <TYPE.body color={theme.text3} textAlign='center'>
            No data.
          </TYPE.body>
        </LightCard>
      )}
      <RowBetween style={{ marginTop: 20 }}>
        <TYPE.subHeader>
          Currently Selected: {selectIds.length}/{pokers.length}
        </TYPE.subHeader>
        <ButtonLight
          onClick={unStateSingle}
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

export default UnStakeSingle
