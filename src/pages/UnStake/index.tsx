import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import UnStakeSingle from './UnstakePokerSingle'
import UnStakeSynthetic from './UnstakePokerSynthetic'
import { DarkCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import { RowFixed } from '@/components/Row'
import { useMiningPool } from '@/hooks/useMining'
import {
  NavTitleTab,
  PageWrapper,
  StakeTabConent,
  TabConent,
  HoverText
} from '@/pages/Stake/styleds'
import { TYPE } from '@/theme'

type StakeType = 'SINGLE' | 'SYNTHETIC'

const UnStake: React.FC = () => {
  const { pairId, type } = useParams<{ pairId: string; type: StakeType }>()
  const poolInfo = useMiningPool(pairId)
  const [stakeType, setStakeType] = useState<StakeType>(type)

  return (
    <>
      <PageWrapper>
        <AutoColumn gap='lg' justify='center'>
          <AutoColumn gap='lg' style={{ width: '100%' }}>
            <Link
              style={{
                textDecoration: 'none',
                width: 'fit-content',
                marginBottom: '0.5rem'
              }}
              to={`/poker/${pairId}`}>
              <HoverText>{'← Back to xPoker Mining'}</HoverText>
            </Link>
            <RowFixed>
              <DoubleCurrencyLogo
                currency0={poolInfo?.token0}
                currency1={poolInfo?.token1}
                size={24}
                margin={true}
              />
              <TYPE.label fontSize={'24px'} mr='10px'>
                &nbsp;{poolInfo?.token0?.symbol}/{poolInfo?.token1?.symbol}
              </TYPE.label>
              <TYPE.mediumHeader fontWeight='bold' marginLeft='10px'>
                My Staked xPoker List
              </TYPE.mediumHeader>
            </RowFixed>
          </AutoColumn>
          <AutoColumn gap='lg' style={{ width: '100%' }}>
            <RowFixed>
              <NavTitleTab
                as={Link}
                to={`/unstake/SINGLE/${pairId}`}
                className={stakeType == 'SINGLE' ? 'ACTIVE' : ''}
                onClick={() => {
                  setStakeType('SINGLE')
                }}>
                Single xPoker
              </NavTitleTab>
              <NavTitleTab
                as={Link}
                to={`/unstake/SYNTHETIC/${pairId}`}
                className={stakeType == 'SYNTHETIC' ? 'ACTIVE' : ''}
                onClick={() => {
                  setStakeType('SYNTHETIC')
                }}>
                Synthetic xPoker
              </NavTitleTab>
            </RowFixed>
            <TabConent>
              {stakeType === 'SINGLE' && <UnStakeSingle pairId={pairId} />}
              {stakeType === 'SYNTHETIC' && (
                <UnStakeSynthetic pairId={pairId} />
              )}
            </TabConent>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export default UnStake
