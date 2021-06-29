import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import SingleStake from './SingleStake'
import SyntheticStake from './SyntheticStake'
import { PageWrapper, NavTitleTab, TabConent, HoverText } from './styleds'
import { AutoColumn } from '@/components/Column'
import DoubleCurrencyLogo from '@/components/DoubleLogo'
import { RowFixed } from '@/components/Row'
import { useMiningPool } from '@/hooks/useMining'
import { TYPE } from '@/theme'

type StakeType = 'SINGLE' | 'SYNTHETIC'

const Stake: React.FC = () => {
  const { t } = useTranslation()
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
              <HoverText>
                {t('← Back to')}
                {t('xPoker Mining')}
              </HoverText>
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
                {stakeType === 'SINGLE'
                  ? t('Stake Single xPoker')
                  : t('Stake Synthetic xPoker')}
              </TYPE.mediumHeader>
            </RowFixed>
          </AutoColumn>
          <AutoColumn gap='lg' style={{ width: '100%' }}>
            <RowFixed>
              <NavTitleTab
                as={Link}
                to={`/stake/SINGLE/${pairId}`}
                className={stakeType == 'SINGLE' ? 'ACTIVE' : ''}
                onClick={() => {
                  setStakeType('SINGLE')
                }}>
                {t('Stake Single xPoker')}
              </NavTitleTab>
              <NavTitleTab
                as={Link}
                to={`/stake/SYNTHETIC/${pairId}`}
                className={stakeType == 'SYNTHETIC' ? 'ACTIVE' : ''}
                onClick={() => {
                  setStakeType('SYNTHETIC')
                }}>
                {t('Stake Synthetic xPoker')}
              </NavTitleTab>
            </RowFixed>
            <TabConent>
              {stakeType === 'SINGLE' && <SingleStake pairId={pairId} />}
              {stakeType === 'SYNTHETIC' && <SyntheticStake pairId={pairId} />}
            </TabConent>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}

export default Stake
