import React, { useContext, useCallback, useState, useEffect } from 'react'

import SingleStakeItem from './SingleStakeItem'
import { ButtonLight } from '@/components/Button'
import { LightCard } from '@/components/Card'
import { RowBetween } from '@/components/Row'
import { useActiveWeb3React } from '@/hooks'
import {
  useXKeyDaoContract,
  useNFTPositionManagerContract
} from '@/hooks/useContract'
import { useUserPokers, useNeedApprove } from '@/hooks/useStake'
import { Dots } from '@/pages/Pool/styleds'
import { PageWrapper } from '@/pages/PoolDetail/styleds'
import { TYPE } from '@/theme'
import { calculateGasMargin } from '@/utils'
import { PokerType } from '@/utils/poker'
import styled, { ThemeContext } from 'styled-components'

type SingleStakeProps = {
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

const SingleStake: React.FC<SingleStakeProps> = ({
  pairId
}: SingleStakeProps) => {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  const [selectIds, selectPokerId] = useState<any>([])
  const [needApprove, setApprove] = useState<any>(false)
  const [approving, setApproving] = useState<any>(false)

  const { pokers, loading } = useUserPokers(account, pairId)

  const xKeyDaoContract = useXKeyDaoContract()
  const positionManager = useNFTPositionManagerContract()

  // const needApprove = useNeedApprove()

  useEffect(() => {
    setApprove(() => selectIds.length > 0)
  }, [selectIds])

  const approve = useCallback(async () => {
    const address = xKeyDaoContract?.address
    const approve = positionManager?.setApprovalForAll

    const approveArgs = [address, true]

    if (approve) {
      setApproving(() => true)
      await approve(...approveArgs, {})
      setApproving(() => false)
      setApprove(() => false)
    }
  }, [xKeyDaoContract, positionManager])

  const stateSingle = useCallback(async () => {
    if (selectIds.length) {
      const args = selectIds
      let estimate
      let method
      if (selectIds.length === 1) {
        estimate = xKeyDaoContract?.estimateGas?.addSwaptokenShareSingle
        method = xKeyDaoContract?.addSwaptokenShareSingle

        if (estimate && method) {
          estimate(...args, {}).then((estimatedGasLimit) => {
            method(...args, {
              gasLimit: calculateGasMargin(estimatedGasLimit)
            })
          })
        }
      } else {
        estimate = xKeyDaoContract?.estimateGas?.addSwaptokenShareSingle
        method = xKeyDaoContract?.addSwaptokenShareSingle

        // estimate(...args, {}).then((estimatedGasLimit) => {
        //   method(...args, {
        //     gasLimit: calculateGasMargin(estimatedGasLimit)
        //   })
        // })
      }
    }
  }, [selectIds, xKeyDaoContract, positionManager])

  const selectPoker = useCallback(
    (tokenId) => {
      selectPokerId((ids) => {
        if (ids.includes(tokenId)) {
          return ids.filter((id) => id !== tokenId)
        } else {
          return ids.length < 5 ? ids.concat([tokenId]) : ids
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
          <TYPE.subHeader>算力</TYPE.subHeader>
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
        <TYPE.subHeader>Currently Selected: {selectIds.length}/{pokers.length}</TYPE.subHeader>
        {needApprove ? (
          approving ? (
            <ButtonLight
              style={{
                width: 'auto',
                padding: '0.4rem .6rem',
                borderRadius: '16px',
                fontSize: '12px'
              }}>
              <Dots>Approving</Dots>
            </ButtonLight>
          ) : (
            <ButtonLight
              onClick={approve}
              style={{
                width: 'auto',
                padding: '0.4rem .6rem',
                borderRadius: '16px',
                fontSize: '12px'
              }}>
              Approve
            </ButtonLight>
          )
        ) : (
          <ButtonLight
            onClick={stateSingle}
            style={{
              width: 'auto',
              padding: '0.4rem .6rem',
              borderRadius: '16px',
              fontSize: '12px'
            }}>
            Stake
          </ButtonLight>
        )}
      </RowBetween>
    </>
  )
}

export default SingleStake
