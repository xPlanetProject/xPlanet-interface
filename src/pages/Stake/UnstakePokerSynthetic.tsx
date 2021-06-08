import React, { useContext, useCallback, useState, useEffect } from 'react'

import { PokerGroupType } from './StakeHelpers'
import UnStakePokerSyntheticItem from './UnstakePokerSyntheticItem'
import { ButtonLight } from '@/components/Button'
import { LightCard } from '@/components/Card'
import { RowBetween } from '@/components/Row'
import { useActiveWeb3React } from '@/hooks'
import {
  useXKeyDaoContract,
  useNFTPositionManagerContract
} from '@/hooks/useContract'
import { usePairsFromTokenIds } from '@/hooks/useStake'
import useTheme from '@/hooks/useTheme'
import { uesUserCombineMaps } from '@/hooks/useUnStake'
import { Dots } from '@/pages/Pool/styleds'
import { PageWrapper } from '@/pages/PoolDetail/styleds'
import { TYPE } from '@/theme'
import { calculateGasMargin } from '@/utils'
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
  & > div:first-child {
    max-width: 80px;
  }
  & > div:not(:first-child) {
    text-align: center;
  }
  :hover {
    background-color: ${({ theme }) => theme.bg2};
  }
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

const SyntheticStake: React.FC<PageProps> = ({ pairId }: PageProps) => {
  const theme = useTheme()

  const { account } = useActiveWeb3React()

  const [selected, setSelected] = useState<any>([])

  const { loading, pokers } = uesUserCombineMaps(account, pairId)
  console.log(pokers)

  const xKeyDaoContract = useXKeyDaoContract()
  const positionManager = useNFTPositionManagerContract()

  const unStateCombine = useCallback(async () => {
    if (selected.length) {
      const estimate = xKeyDaoContract?.estimateGas?.removeSwaptokenShareCombine
      const removeSwaptokenShareCombine =
        xKeyDaoContract?.removeSwaptokenShareCombine
      const args = selected

      if (estimate && removeSwaptokenShareCombine) {
        estimate(args, {}).then((estimatedGasLimit) => {
          removeSwaptokenShareCombine(args, {
            gasLimit: calculateGasMargin(estimatedGasLimit)
          })
        })
      }
    }
  }, [selected, xKeyDaoContract, positionManager])

  const selectPoker = useCallback(
    (combineIndex) => {
      setSelected((ids) => {
        if (ids.includes(combineIndex)) {
          return ids.filter((id) => id !== combineIndex)
        } else {
          return ids.length < 1 ? ids.concat([combineIndex]) : ids
        }
      })
    },
    [selected]
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
          <TYPE.subHeader>#</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>组合牌型</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>流动性总份额</TYPE.subHeader>
        </StakeCheckouSection>
        <StakeCheckouSection>
          <TYPE.subHeader>算力</TYPE.subHeader>
        </StakeCheckouSection>
        <DropDownWrapper>
          <TYPE.subHeader>操作</TYPE.subHeader>
        </DropDownWrapper>
      </Row>
      {pokers.length ? (
        pokers.map((item, index) => {
          return (
            <UnStakePokerSyntheticItem
              data={item}
              key={index}
              selected={selected}
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
          Currently Selected: {selected.length}/{pokers.length}
        </TYPE.subHeader>
        <ButtonLight
          onClick={unStateCombine}
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

export default SyntheticStake
