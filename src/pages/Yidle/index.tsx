import React, { useContext } from 'react'

import styled, { ThemeContext } from 'styled-components'
import { HideSmall, TYPE } from '@/theme'

import { AutoColumn } from '@/components/Column'
import { RowBetween } from '@/components/Row'

import AppBody from '../AppBody'

const PageWrapper = styled(AutoColumn)`
  max-width: 870px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 500px;
  `};
`

const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.text2};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

export default function Yield() {
  const theme = useContext(ThemeContext)
  console.log(theme)

  return (
    <>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow>
              <HideSmall>
                <TYPE.mediumHeader>xLP NFT Mining</TYPE.mediumHeader>
              </HideSmall>
            </TitleRow>

            <AppBody>
              <div>xLP NFT Mining</div>
            </AppBody>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
