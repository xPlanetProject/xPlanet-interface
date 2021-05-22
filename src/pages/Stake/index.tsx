import React, { useState } from 'react'

import SingleStake from './single-stake'
import { TitleRow, PageWrapper, StakeTabConent } from './styleds'
import SyntheticStake from './synthetic-stake'
import { ButtonLight, ButtonGray } from '@/components/Button'
import { DarkCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import { RowFixed } from '@/components/Row'
import { HideSmall, TYPE } from '@/theme'

type StakeType = 'SINGLE' | 'SYNTHETIC'

const Stake: React.FC = () => {
  const [stakeType, setStakeType] = useState<StakeType>('SINGLE')

  return (
    <>
      <PageWrapper>
        <AutoColumn gap='lg' justify='center'>
          <AutoColumn gap='lg' style={{ width: '100%' }}>
            <TitleRow>
              <HideSmall>
                <TYPE.mediumHeader>
                  {stakeType === 'SINGLE'
                    ? 'Stake Single xPoker'
                    : 'Stake Synthetic xPoker'}
                </TYPE.mediumHeader>
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
                Stake Single xPoker
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
                Stake Synthetic xPoker
              </ButtonGray>
            </RowFixed>
            <DarkCard>
              <StakeTabConent>
                {stakeType === 'SINGLE' && <SingleStake />}
                {stakeType === 'SYNTHETIC' && <SyntheticStake />}
              </StakeTabConent>
            </DarkCard>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export default Stake
