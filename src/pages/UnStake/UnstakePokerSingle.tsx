import React, { useState, useCallback } from 'react'

import { LightCard } from '@/components/Card'
import { useActiveWeb3React } from '@/hooks'
import {
  useXKeyDaoContract,
  useNFTPositionManagerContract
} from '@/hooks/useContract'
import useTheme from '@/hooks/useTheme'
import { uesSingleMaps } from '@/hooks/useUnStake'
import { Dots } from '@/pages/Pool/styleds'
import SingleStakeItem from '@/pages/Stake/SingleStakeItem'
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

type PageProps = {
  pairId: string
}

const UnStakeSingle: React.FC<PageProps> = ({ pairId }: PageProps) => {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const [selectIds, selectPokerId] = useState<any>([])

  const { pokers, loading } = uesSingleMaps(account, pairId)

  const xKeyDaoContract = useXKeyDaoContract()

  const unStateSingle = useCallback(async () => {
    if (selectIds.length) {
      const estimate = xKeyDaoContract?.estimateGas?.removeSwaptokenShareSingle
      const removeSwaptokenShareSingle =
        xKeyDaoContract?.removeSwaptokenShareSingle
      const args = selectIds

      if (estimate && removeSwaptokenShareSingle) {
        estimate(args, {}).then((estimatedGasLimit) => {
          removeSwaptokenShareSingle(args, {
            gasLimit: calculateGasMargin(estimatedGasLimit)
          }).then((response) => {
            addTransaction(response, {
              summary: `Unstake ${selectIds.length} NFT`
            })
          })
        })
      }
    }
  }, [selectIds, xKeyDaoContract])

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
      <WarpperDarkCard>
        <TYPE.body color={theme.text3} textAlign='center' padding='40px'>
          <Dots>Loading</Dots>
        </TYPE.body>
      </WarpperDarkCard>
    )
  }

  return (
    <>
      <WarpperDarkCard>
        <Row isHeader={true}>
          <Column>
            <TYPE.darkGray fontWeight='bold' fontSize='0.75rem'></TYPE.darkGray>
          </Column>
          <Column>
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
              <SingleStakeItem
                data={item}
                key={item?.tokenIdStr || index}
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
      </WarpperDarkCard>

      <ActionRow style={{ marginTop: 20 }}>
        <TYPE.darkGray fontWeight='bold' fontSize='14px'>
          {selectIds.length}/{pokers.length} Selected
        </TYPE.darkGray>
        <ResponsiveButtonPrimary
          onClick={unStateSingle}
          disabled={selectIds.length == 0}>
          UnStake
        </ResponsiveButtonPrimary>
      </ActionRow>
    </>
  )
}

export default UnStakeSingle
