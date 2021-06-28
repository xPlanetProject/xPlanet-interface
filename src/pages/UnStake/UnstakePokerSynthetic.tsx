import React, { useCallback, useState } from 'react'

import UnStakePokerSyntheticItem from './UnstakePokerSyntheticItem'
import { LightCard } from '@/components/Card'
import { useActiveWeb3React } from '@/hooks'
import {
  useXKeyDaoContract,
  useNFTPositionManagerContract
} from '@/hooks/useContract'
import useTheme from '@/hooks/useTheme'
import { uesUserCombineMaps } from '@/hooks/useUnStake'
import { Dots } from '@/pages/Pool/styleds'
import { PageWrapper } from '@/pages/PoolDetail/styleds'
import {
  Row,
  Column,
  ActionRow,
  WarpperDarkCard,
  ResponsiveButtonPrimary
} from '@/pages/Stake/styleds'
import { useTransactionAdder } from '@/state/transactions/hooks'
import { TYPE } from '@/theme'
import { calculateGasMargin } from '@/utils'
import styled from 'styled-components'

type PageProps = {
  pairId: string
}

const SyntheticStake: React.FC<PageProps> = ({ pairId }: PageProps) => {
  const theme = useTheme()

  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const [selected, setSelected] = useState<any>([])

  const { loading, pokers } = uesUserCombineMaps(account, pairId)

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
          }).then((response) => {
            addTransaction(response, {
              summary: `Unstake Synthetic NFTs`
            })
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
      <WarpperDarkCard>
        <Row isHeader={true}>
          <Column width='80px'>
            <TYPE.darkGray fontWeight='bold' fontSize='0.75rem'></TYPE.darkGray>
          </Column>
          <Column width='160px'>
            <TYPE.darkGray fontWeight='bold' fontSize='0.75rem'>
              Poker
            </TYPE.darkGray>
          </Column>
          <Column>
            <TYPE.darkGray fontWeight='bold' fontSize='0.75rem'>
              ID
            </TYPE.darkGray>
          </Column>
          <Column flex='1'>
            <TYPE.darkGray fontWeight='bold' fontSize='0.75rem'>
              Liquidity Share
            </TYPE.darkGray>
          </Column>
          <Column flex='1'>
            <TYPE.darkGray fontWeight='bold' fontSize='0.75rem'>
              Calculating power
            </TYPE.darkGray>
          </Column>
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
      </WarpperDarkCard>
      <ActionRow>
        <TYPE.darkGray fontWeight='bold' fontSize='14px'>
          {selected.length}/{pokers.length} Selected
        </TYPE.darkGray>
        <ResponsiveButtonPrimary
          onClick={unStateCombine}
          disabled={selected.length != 1}>
          UnStake
        </ResponsiveButtonPrimary>
      </ActionRow>
    </>
  )
}

export default SyntheticStake
