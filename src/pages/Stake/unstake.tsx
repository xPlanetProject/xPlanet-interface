import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import UnStakeSingle from './UnstakePokerSingle'
import UnStakeSynthetic from './UnstakePokerSynthetic'
import { TitleRow, PageWrapper, StakeTabConent, HoverText } from './styleds'
import { ButtonLight, ButtonGray } from '@/components/Button'
import { DarkCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import { RowFixed } from '@/components/Row'
import { useMiningPool } from '@/hooks/useMining'
import { HideSmall, TYPE } from '@/theme'

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
                &nbsp;{poolInfo?.token0?.symbol}&nbsp;/&nbsp;
                {poolInfo?.token1?.symbol}
              </TYPE.label>
            </RowFixed>
          </AutoColumn>
          <AutoColumn gap='lg' style={{ width: '100%' }}>
            <TitleRow>
              <HideSmall>
                <TYPE.mediumHeader>My Staked xPoker List</TYPE.mediumHeader>
              </HideSmall>
            </TitleRow>
            <RowFixed>
              <ButtonLight
                onClick={() => {
                  setStakeType('SINGLE')
                }}
                style={{
                  width: 'auto',
                  padding: '0.4rem .6rem',
                  borderRadius: '16px',
                  fontSize: '12px'
                }}>
                Single xPoker
              </ButtonLight>
              <ButtonGray
                onClick={() => {
                  setStakeType('SYNTHETIC')
                }}
                style={{
                  width: 'auto',
                  padding: '0.4rem .6rem',
                  borderRadius: '16px',
                  fontSize: '12px',
                  marginLeft: '20px'
                }}>
                Synthetic xPoker
              </ButtonGray>
            </RowFixed>
            <DarkCard>
              <StakeTabConent>
                {stakeType === 'SINGLE' && <UnStakeSingle pairId={pairId} />}
                {stakeType === 'SYNTHETIC' && (
                  <UnStakeSynthetic pairId={pairId} />
                )}
              </StakeTabConent>
            </DarkCard>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export default UnStake
