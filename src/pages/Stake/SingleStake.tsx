import React, { useContext, useCallback, useState } from 'react'

import SingleStakeItem from './SingleStakeItem'
import {
  Row,
  Column,
  ActionRow,
  WarpperDarkCard,
  ResponsiveButtonPrimary
} from './styleds'
import { LightCard } from '@/components/Card'
import { useActiveWeb3React } from '@/hooks'
import {
  useXKeyDaoContract,
  useNFTPositionManagerContract
} from '@/hooks/useContract'
import { useUserPokers, useNeedApprove } from '@/hooks/useStake'
import { Dots } from '@/pages/Pool/styleds'
import { useTransactionAdder } from '@/state/transactions/hooks'
import { TYPE } from '@/theme'
import { calculateGasMargin } from '@/utils'
import { ThemeContext } from 'styled-components'

type SingleStakeProps = {
  pairId: string
}

const SingleStake: React.FC<SingleStakeProps> = ({
  pairId
}: SingleStakeProps) => {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  const [selectIds, selectPokerId] = useState<any>([])
  const [approving, setApproving] = useState<any>(false)

  const { pokers, loading } = useUserPokers(account, pairId)

  const xKeyDaoContract = useXKeyDaoContract()
  const positionManager = useNFTPositionManagerContract()

  const needApprove = useNeedApprove()

  const addTransaction = useTransactionAdder()

  const approve = useCallback(async () => {
    const address = xKeyDaoContract?.address
    const approve = positionManager?.setApprovalForAll

    const approveArgs = [address, true]

    if (approve) {
      setApproving(() => true)
      approve(...approveArgs, {}).then((response) => {
        addTransaction(response, {
          summary: 'Approve all of Nfts to ' + address
        })
        setApproving(() => false)
      })
    }
  }, [xKeyDaoContract, positionManager])

  const stateSingle = useCallback(async () => {
    const { length } = selectIds
    if (length) {
      const args = selectIds
      const estimate = xKeyDaoContract?.estimateGas?.addSwaptokenShareSingle
      const method = xKeyDaoContract?.addSwaptokenShareSingle

      if (estimate && method) {
        estimate(args, {}).then((estimatedGasLimit) => {
          method(args, {
            gasLimit: calculateGasMargin(estimatedGasLimit)
          }).then((response) => {
            addTransaction(response, {
              summary: `Stake ${length} NFT to Mining`
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

      <ActionRow>
        <TYPE.darkGray fontWeight='bold' fontSize='14px'>
          {selectIds.length}/{pokers.length} Selected
        </TYPE.darkGray>
        {needApprove ? (
          approving ? (
            <ResponsiveButtonPrimary>
              <Dots>Approving</Dots>
            </ResponsiveButtonPrimary>
          ) : (
            <ResponsiveButtonPrimary onClick={approve}>
              Approve
            </ResponsiveButtonPrimary>
          )
        ) : (
          <ResponsiveButtonPrimary onClick={stateSingle}>
            Stake
          </ResponsiveButtonPrimary>
        )}
      </ActionRow>
    </>
  )
}

export default SingleStake
