import React, { useContext, useCallback, useState, useEffect } from 'react'

import SingleStakeItem from './SingleStakeItem'
import {
  Row,
  Column,
  ActionRow,
  WarpperDarkCard,
  ResponsiveButtonPrimary,
  SelectedPoker,
  PokerItem,
  ActionRowBetween
} from './styleds'
import { LightCard } from '@/components/Card'
import { RowBetween } from '@/components/Row'
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

type SyntheticStakeProps = {
  pairId: string
}

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
          summary: 'Approve all of NFTS to ' + address
        })
        setApproving(() => false)
      })
    }
  }, [xKeyDaoContract, positionManager])

  const stateSingle = useCallback(async () => {
    const { length } = selectIds
    if (length) {
      const args = selectIds
      const estimate = xKeyDaoContract?.estimateGas?.addSwaptokenShareCombine
      const method = xKeyDaoContract?.addSwaptokenShareCombine

      if (estimate && method) {
        estimate(args, {}).then((estimatedGasLimit) => {
          method(args, {
            gasLimit: calculateGasMargin(estimatedGasLimit)
          }).then((response) => {
            addTransaction(response, {
              summary: 'SyntheticStake Nfts to Mining'
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
      <WarpperDarkCard>
        <TYPE.body color={theme.text3} padding='40px' textAlign='center'>
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

      <ActionRow marginTop='1rem'>
        <SelectedPoker>
          {selectPokers.map((poker, index) => {
            return (
              <PokerItem key={poker?.tokenIdStr || index}>
                {poker?.pokerInfo?.faceIcon} {poker?.pokerInfo?.face}
              </PokerItem>
            )
          })}
          {new Array(5 - selectPokers.length)
            .fill('poker')
            .map((item, index) => {
              return <PokerItem key={`${item}${index}`}></PokerItem>
            })}
        </SelectedPoker>

        <ActionRowBetween>
          <RowBetween>
            <TYPE.main fontWeight='bold' fontSize='14px'>
              Hands
            </TYPE.main>
            <TYPE.body fontWeight='bold' fontSize='14px'>
              Full House
            </TYPE.body>
          </RowBetween>
          <RowBetween>
            <TYPE.main fontWeight='bold' fontSize='14px'>
              Calculating Power
            </TYPE.main>
            <TYPE.body fontWeight='bold' fontSize='14px'>
              120.1231556
            </TYPE.body>
          </RowBetween>

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
        </ActionRowBetween>
      </ActionRow>
    </>
  )
}

export default SyntheticStake
