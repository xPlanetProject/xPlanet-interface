import { Link } from 'react-router-dom'

import { RowBetween, AutoRow } from '@/components/Row'
import styled from 'styled-components'

export const ResponsiveRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    row-gap: 16px;
    width: 100%:
  `};
`

export const PowerRow = styled(AutoRow)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  `};
`

export const PowerInfoDivider = styled.div`
  width: 90%;
  height: 1px;
  margin: 20px auto;

  ${({ theme }) => `background: ${theme.bg1};`};
`

export const PowerCard = styled.div`
  flex: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
`

export const PokerImage = styled.div`
  width: 80%;
  height: 320px;
  margin: 0 auto;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`

export const StakeLink = styled(Link)`
  text-decoration: none;
`
export const Separator = styled.div`
  width: 1px;
  height: auto;
  background-color: ${({ theme }) => theme.bg2};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 1px;
    width: auto;
  `};
`
