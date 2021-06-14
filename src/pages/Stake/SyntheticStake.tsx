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
import { useTransactionAdder } from '@/state/transactions/hooks'
import styled, { ThemeContext } from 'styled-components'

type SyntheticStakeProps = {
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

const PokerItem = styled.div`
  flex: 1;
  border-radius: 8px;
  padding: 24px;
  margin: 0 10px;
  background-color: ${({ theme }) => theme.bg2};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 180px;
  :hover {
    background-color: ${({ theme }) => theme.bg3};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-height: 100px;
    padding: 12px;
    margin: 0 4px;
  `};
`

const SyntheticStake: React.FC<SyntheticStakeProps> = ({
  pairId
}: SyntheticStakeProps) => {
  const theme = useContext(ThemeContext)

  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const [selectIds, selectPokerId] = useState<any>([])
  const [selectPokers, setSelectPokers] = useState<any>([])
  const [approving, setApproving] = useState<any>(false)

  const needApprove = useNeedApprove()

  const { pokers, loading } = useUserPokers(account, pairId)

  const xKeyDaoContract = useXKeyDaoContract()
  const positionManager = useNFTPositionManagerContract()

  const approve = useCallback(async () => {
    const address = xKeyDaoContract?.address
    const approve = positionManager?.setApprovalForAll

    const approveArgs = [address, true]

    if (approve) {
      setApproving(() => true)
      approve(...approveArgs, {}).then((response) => {
        addTransaction(response, {
          summary:
            'Approve all of NFTS to ' +
            address
        })
        setApproving(() => false)
      })
    }
  }, [xKeyDaoContract, positionManager])

  const stateSingle = useCallback(async () => {
    if (selectIds.length) {
      const estimate = xKeyDaoContract?.estimateGas?.addSwaptokenShareCombine
      const addSwaptokenShareCombine = xKeyDaoContract?.addSwaptokenShareCombine
      const args = selectIds

      if (estimate && addSwaptokenShareCombine) {
        estimate(args, {}).then((estimatedGasLimit) => {
          addSwaptokenShareCombine(args, {
            gasLimit: calculateGasMargin(estimatedGasLimit)
          }).then(response => {
            addTransaction(response, {
              summary:
                'SyntheticStake Nfts to Mining'
            })
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
          return ids.length < 5 ? ids.concat([tokenId]) : ids
        }
      })
    },
    [selectIds]
  )

  useEffect(() => {
    setSelectPokers(() => {
      return selectIds.map((tokenId) =>
        pokers.find(({ tokenIdStr }) => tokenIdStr === tokenId)
      )
    })
  }, [selectIds, pokers])

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
      <RowBetween>
        {selectPokers.map((poker) => {
          return (
            <PokerItem key={poker?.tokenIdStr}>
              {poker?.pokerInfo?.faceIcon} {poker?.pokerInfo?.face}
            </PokerItem>
          )
        })}
        {new Array(5 - selectPokers.length).fill('poker').map((item, index) => {
          return <PokerItem key={`${item}${index}`}></PokerItem>
        })}
      </RowBetween>
      {/* <PokerResult>
        <TYPE.subHeader>牌型：黑桃 A 算力：5000 总份额：50000</TYPE.subHeader>
      </PokerResult> */}
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
              key={item?.tokenIdStr}
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

export default SyntheticStake
