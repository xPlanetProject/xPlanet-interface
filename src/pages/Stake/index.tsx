import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import SingleStake from './single-stake'
import { TitleRow, PageWrapper, StakeTabConent, HoverText } from './styleds'
import SyntheticStake from './synthetic-stake'
import { ButtonLight, ButtonGray } from '@/components/Button'
import { DarkCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import { RowFixed } from '@/components/Row'
import { useMiningPool } from '@/hooks/useMining'
import { HideSmall, TYPE } from '@/theme'

type StakeType = 'SINGLE' | 'SYNTHETIC'

const Stake: React.FC = () => {
  const [stakeType, setStakeType] = useState<StakeType>('SINGLE')
  const { pairId } = useParams<{ pairId: string }>()
  const poolInfo = useMiningPool(pairId)

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
