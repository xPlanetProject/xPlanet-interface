import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import { Pair } from '@uniswap/sdk'

import { DarkCard } from '@/components/Card'
import { AutoColumn } from '@/components/Column'
import { NFT } from '@/components/NFT'
import { usePairs } from '@/data/Reserves'
import { useActiveWeb3React } from '@/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from '@/state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '@/state/wallet/hooks'
import { unwrappedToken } from '@/utils/wrappedCurrency'

import { PageWrapper, ResponsiveRow, HoverText } from './styleds'
import LiquidityInfo from './LiquidityInfo'
import PriceInfo from './PriceInfo'

const metadata = {"valid":true,"loading":false,"result":{"name":"Uniswap - 0.05% - DAI/WETH - 51.977<>52.081","description":"This NFT represents a liquidity position in a Uniswap V3 DAI-WETH pool. The owner of this NFT can modify or redeem the position.\n\nPool Address: 0xcc2158f95786cae412e2b1ea352df8ef47a1f15c\nDAI Address: 0xad6d458402f60fd3bd25163575031acdce07538d\nWETH Address: 0xc778417e063141139fce010982780140aa0cd5ab\nFee Tier: 0.05%\nToken ID: 1005\n\nâ ï¸ DISCLAIMER: Due diligence is imperative when assessing this NFT. Make sure token addresses match the expected tokens, as token symbols may be imitated.","image":"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjkwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDI5MCA1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnPjxkZWZzPjxmaWx0ZXIgaWQ9ImYxIj48ZmVJbWFnZSByZXN1bHQ9InAwIiB4bGluazpocmVmPSJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUIzYVdSMGFEMG5Namt3SnlCb1pXbG5hSFE5SnpVd01DY2dkbWxsZDBKdmVEMG5NQ0F3SURJNU1DQTFNREFuSUhodGJHNXpQU2RvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBd0wzTjJaeWMrUEhKbFkzUWdkMmxrZEdnOUp6STVNSEI0SnlCb1pXbG5hSFE5SnpVd01IQjRKeUJtYVd4c1BTY2pZV1EyWkRRMUp5OCtQQzl6ZG1jKyIvPjxmZUltYWdlIHJlc3VsdD0icDEiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjNhV1IwYUQwbk1qa3dKeUJvWldsbmFIUTlKelV3TUNjZ2RtbGxkMEp2ZUQwbk1DQXdJREk1TUNBMU1EQW5JSGh0Ykc1elBTZG9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5YytQR05wY21Oc1pTQmplRDBuTVRZM0p5QmplVDBuTWpFeUp5QnlQU2N4TWpCd2VDY2dabWxzYkQwbkkyTTNOemcwTVNjdlBqd3ZjM1puUGc9PSIvPjxmZUltYWdlIHJlc3VsdD0icDIiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjNhV1IwYUQwbk1qa3dKeUJvWldsbmFIUTlKelV3TUNjZ2RtbGxkMEp2ZUQwbk1DQXdJREk1TUNBMU1EQW5JSGh0Ykc1elBTZG9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5YytQR05wY21Oc1pTQmplRDBuTWpVNEp5QmplVDBuTVRrd0p5QnlQU2N4TWpCd2VDY2dabWxzYkQwbkl6QTNOVE00WkNjdlBqd3ZjM1puUGc9PSIgLz48ZmVJbWFnZSByZXN1bHQ9InAzIiB4bGluazpocmVmPSJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUIzYVdSMGFEMG5Namt3SnlCb1pXbG5hSFE5SnpVd01DY2dkbWxsZDBKdmVEMG5NQ0F3SURJNU1DQTFNREFuSUhodGJHNXpQU2RvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBd0wzTjJaeWMrUEdOcGNtTnNaU0JqZUQwbk1qSTRKeUJqZVQwbk5EWXhKeUJ5UFNjeE1EQndlQ2NnWm1sc2JEMG5JekJqWkRWaFlpY3ZQand2YzNablBnPT0iIC8+PGZlQmxlbmQgbW9kZT0ib3ZlcmxheSIgaW49InAwIiBpbjI9InAxIiAvPjxmZUJsZW5kIG1vZGU9ImV4Y2x1c2lvbiIgaW4yPSJwMiIgLz48ZmVCbGVuZCBtb2RlPSJvdmVybGF5IiBpbjI9InAzIiByZXN1bHQ9ImJsZW5kT3V0IiAvPjxmZUdhdXNzaWFuQmx1ciBpbj0iYmxlbmRPdXQiIHN0ZERldmlhdGlvbj0iNDIiIC8+PC9maWx0ZXI+IDxjbGlwUGF0aCBpZD0iY29ybmVycyI+PHJlY3Qgd2lkdGg9IjI5MCIgaGVpZ2h0PSI1MDAiIHJ4PSI0MiIgcnk9IjQyIiAvPjwvY2xpcFBhdGg+PHBhdGggaWQ9InRleHQtcGF0aC1hIiBkPSJNNDAgMTIgSDI1MCBBMjggMjggMCAwIDEgMjc4IDQwIFY0NjAgQTI4IDI4IDAgMCAxIDI1MCA0ODggSDQwIEEyOCAyOCAwIDAgMSAxMiA0NjAgVjQwIEEyOCAyOCAwIDAgMSA0MCAxMiB6IiAvPjxwYXRoIGlkPSJtaW5pbWFwIiBkPSJNMjM0IDQ0NEMyMzQgNDU3Ljk0OSAyNDIuMjEgNDYzIDI1MyA0NjMiIC8+PGZpbHRlciBpZD0idG9wLXJlZ2lvbi1ibHVyIj48ZmVHYXVzc2lhbkJsdXIgaW49IlNvdXJjZUdyYXBoaWMiIHN0ZERldmlhdGlvbj0iMjQiIC8+PC9maWx0ZXI+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVwIiB4MT0iMSIgeDI9IjAiIHkxPSIxIiB5Mj0iMCI+PHN0b3Agb2Zmc2V0PSIwLjAiIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjEiIC8+PHN0b3Agb2Zmc2V0PSIuOSIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZC1kb3duIiB4MT0iMCIgeDI9IjEiIHkxPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwLjAiIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjEiIC8+PHN0b3Agb2Zmc2V0PSIwLjkiIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjAiIC8+PC9saW5lYXJHcmFkaWVudD48bWFzayBpZD0iZmFkZS11cCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InVybCgjZ3JhZC11cCkiIC8+PC9tYXNrPjxtYXNrIGlkPSJmYWRlLWRvd24iIG1hc2tDb250ZW50VW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJ1cmwoI2dyYWQtZG93bikiIC8+PC9tYXNrPjxtYXNrIGlkPSJub25lIiBtYXNrQ29udGVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCI+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0id2hpdGUiIC8+PC9tYXNrPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZC1zeW1ib2wiPjxzdG9wIG9mZnNldD0iMC43IiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIxIiAvPjxzdG9wIG9mZnNldD0iLjk1IiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIiAvPjwvbGluZWFyR3JhZGllbnQ+PG1hc2sgaWQ9ImZhZGUtc3ltYm9sIiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHJlY3Qgd2lkdGg9IjI5MHB4IiBoZWlnaHQ9IjIwMHB4IiBmaWxsPSJ1cmwoI2dyYWQtc3ltYm9sKSIgLz48L21hc2s+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCNjb3JuZXJzKSI+PHJlY3QgZmlsbD0iYWQ2ZDQ1IiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI5MHB4IiBoZWlnaHQ9IjUwMHB4IiAvPjxyZWN0IHN0eWxlPSJmaWx0ZXI6IHVybCgjZjEpIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI5MHB4IiBoZWlnaHQ9IjUwMHB4IiAvPiA8ZyBzdHlsZT0iZmlsdGVyOnVybCgjdG9wLXJlZ2lvbi1ibHVyKTsgdHJhbnNmb3JtOnNjYWxlKDEuNSk7IHRyYW5zZm9ybS1vcmlnaW46Y2VudGVyIHRvcDsiPjxyZWN0IGZpbGw9Im5vbmUiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjkwcHgiIGhlaWdodD0iNTAwcHgiIC8+PGVsbGlwc2UgY3g9IjUwJSIgY3k9IjBweCIgcng9IjE4MHB4IiByeT0iMTIwcHgiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuODUiIC8+PC9nPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyOTAiIGhlaWdodD0iNTAwIiByeD0iNDIiIHJ5PSI0MiIgZmlsbD0icmdiYSgwLDAsMCwwKSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIC8+PC9nPjx0ZXh0IHRleHQtcmVuZGVyaW5nPSJvcHRpbWl6ZVNwZWVkIj48dGV4dFBhdGggc3RhcnRPZmZzZXQ9Ii0xMDAlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IidDb3VyaWVyIE5ldycsIG1vbm9zcGFjZSIgZm9udC1zaXplPSIxMHB4IiB4bGluazpocmVmPSIjdGV4dC1wYXRoLWEiPjB4Yzc3ODQxN2UwNjMxNDExMzlmY2UwMTA5ODI3ODAxNDBhYTBjZDVhYiDigKIgV0VUSCA8YW5pbWF0ZSBhZGRpdGl2ZT0ic3VtIiBhdHRyaWJ1dGVOYW1lPSJzdGFydE9mZnNldCIgZnJvbT0iMCUiIHRvPSIxMDAlIiBiZWdpbj0iMHMiIGR1cj0iMzBzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz48L3RleHRQYXRoPiA8dGV4dFBhdGggc3RhcnRPZmZzZXQ9IjAlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IidDb3VyaWVyIE5ldycsIG1vbm9zcGFjZSIgZm9udC1zaXplPSIxMHB4IiB4bGluazpocmVmPSIjdGV4dC1wYXRoLWEiPjB4Yzc3ODQxN2UwNjMxNDExMzlmY2UwMTA5ODI3ODAxNDBhYTBjZDVhYiDigKIgV0VUSCA8YW5pbWF0ZSBhZGRpdGl2ZT0ic3VtIiBhdHRyaWJ1dGVOYW1lPSJzdGFydE9mZnNldCIgZnJvbT0iMCUiIHRvPSIxMDAlIiBiZWdpbj0iMHMiIGR1cj0iMzBzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4gPC90ZXh0UGF0aD48dGV4dFBhdGggc3RhcnRPZmZzZXQ9IjUwJSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSInQ291cmllciBOZXcnLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTBweCIgeGxpbms6aHJlZj0iI3RleHQtcGF0aC1hIj4weGFkNmQ0NTg0MDJmNjBmZDNiZDI1MTYzNTc1MDMxYWNkY2UwNzUzOGQg4oCiIERBSSA8YW5pbWF0ZSBhZGRpdGl2ZT0ic3VtIiBhdHRyaWJ1dGVOYW1lPSJzdGFydE9mZnNldCIgZnJvbT0iMCUiIHRvPSIxMDAlIiBiZWdpbj0iMHMiIGR1cj0iMzBzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz48L3RleHRQYXRoPjx0ZXh0UGF0aCBzdGFydE9mZnNldD0iLTUwJSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSInQ291cmllciBOZXcnLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTBweCIgeGxpbms6aHJlZj0iI3RleHQtcGF0aC1hIj4weGFkNmQ0NTg0MDJmNjBmZDNiZDI1MTYzNTc1MDMxYWNkY2UwNzUzOGQg4oCiIERBSSA8YW5pbWF0ZSBhZGRpdGl2ZT0ic3VtIiBhdHRyaWJ1dGVOYW1lPSJzdGFydE9mZnNldCIgZnJvbT0iMCUiIHRvPSIxMDAlIiBiZWdpbj0iMHMiIGR1cj0iMzBzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz48L3RleHRQYXRoPjwvdGV4dD48ZyBtYXNrPSJ1cmwoI2ZhZGUtc3ltYm9sKSI+PHJlY3QgZmlsbD0ibm9uZSIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyOTBweCIgaGVpZ2h0PSIyMDBweCIgLz4gPHRleHQgeT0iNzBweCIgeD0iMzJweCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSInQ291cmllciBOZXcnLCBtb25vc3BhY2UiIGZvbnQtd2VpZ2h0PSIyMDAiIGZvbnQtc2l6ZT0iMzZweCI+REFJL1dFVEg8L3RleHQ+PHRleHQgeT0iMTE1cHgiIHg9IjMycHgiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iJ0NvdXJpZXIgTmV3JywgbW9ub3NwYWNlIiBmb250LXdlaWdodD0iMjAwIiBmb250LXNpemU9IjM2cHgiPjAuMDUlPC90ZXh0PjwvZz48cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSIyNTgiIGhlaWdodD0iNDY4IiByeD0iMjYiIHJ5PSIyNiIgZmlsbD0icmdiYSgwLDAsMCwwKSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIC8+PGcgbWFzaz0idXJsKCNmYWRlLWRvd24pIiBzdHlsZT0idHJhbnNmb3JtOnRyYW5zbGF0ZSg3MnB4LDE4OXB4KSI+PHJlY3QgeD0iLTE2cHgiIHk9Ii0xNnB4IiB3aWR0aD0iMTgwcHgiIGhlaWdodD0iMTgwcHgiIGZpbGw9Im5vbmUiIC8+PHBhdGggZD0iTTEgMUM0MSA0MSAxMDUgMTA1IDE0NSAxNDUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjMpIiBzdHJva2Utd2lkdGg9IjMycHgiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz48L2c+PGcgbWFzaz0idXJsKCNmYWRlLWRvd24pIiBzdHlsZT0idHJhbnNmb3JtOnRyYW5zbGF0ZSg3MnB4LDE4OXB4KSI+PHJlY3QgeD0iLTE2cHgiIHk9Ii0xNnB4IiB3aWR0aD0iMTgwcHgiIGhlaWdodD0iMTgwcHgiIGZpbGw9Im5vbmUiIC8+PHBhdGggZD0iTTEgMUM0MSA0MSAxMDUgMTA1IDE0NSAxNDUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwxKSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiAvPjwvZz48Y2lyY2xlIGN4PSI3M3B4IiBjeT0iMTkwcHgiIHI9IjRweCIgZmlsbD0id2hpdGUiIC8+PGNpcmNsZSBjeD0iNzNweCIgY3k9IjE5MHB4IiByPSIyNHB4IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiAvPiA8ZyBzdHlsZT0idHJhbnNmb3JtOnRyYW5zbGF0ZSgyOXB4LCAzODRweCkiPjxyZWN0IHdpZHRoPSI4NHB4IiBoZWlnaHQ9IjI2cHgiIHJ4PSI4cHgiIHJ5PSI4cHgiIGZpbGw9InJnYmEoMCwwLDAsMC42KSIgLz48dGV4dCB4PSIxMnB4IiB5PSIxN3B4IiBmb250LWZhbWlseT0iJ0NvdXJpZXIgTmV3JywgbW9ub3NwYWNlIiBmb250LXNpemU9IjEycHgiIGZpbGw9IndoaXRlIj48dHNwYW4gZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjYpIj5JRDogPC90c3Bhbj4xMDA1PC90ZXh0PjwvZz4gPGcgc3R5bGU9InRyYW5zZm9ybTp0cmFuc2xhdGUoMjlweCwgNDE0cHgpIj48cmVjdCB3aWR0aD0iMTQwcHgiIGhlaWdodD0iMjZweCIgcng9IjhweCIgcnk9IjhweCIgZmlsbD0icmdiYSgwLDAsMCwwLjYpIiAvPjx0ZXh0IHg9IjEycHgiIHk9IjE3cHgiIGZvbnQtZmFtaWx5PSInQ291cmllciBOZXcnLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTJweCIgZmlsbD0id2hpdGUiPjx0c3BhbiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNikiPk1pbiBUaWNrOiA8L3RzcGFuPi0zOTUzMDwvdGV4dD48L2c+IDxnIHN0eWxlPSJ0cmFuc2Zvcm06dHJhbnNsYXRlKDI5cHgsIDQ0NHB4KSI+PHJlY3Qgd2lkdGg9IjE0MHB4IiBoZWlnaHQ9IjI2cHgiIHJ4PSI4cHgiIHJ5PSI4cHgiIGZpbGw9InJnYmEoMCwwLDAsMC42KSIgLz48dGV4dCB4PSIxMnB4IiB5PSIxN3B4IiBmb250LWZhbWlseT0iJ0NvdXJpZXIgTmV3JywgbW9ub3NwYWNlIiBmb250LXNpemU9IjEycHgiIGZpbGw9IndoaXRlIj48dHNwYW4gZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjYpIj5NYXggVGljazogPC90c3Bhbj4tMzk1MTA8L3RleHQ+PC9nPjxnIHN0eWxlPSJ0cmFuc2Zvcm06dHJhbnNsYXRlKDIyNnB4LCA0MzNweCkiPjxyZWN0IHdpZHRoPSIzNnB4IiBoZWlnaHQ9IjM2cHgiIHJ4PSI4cHgiIHJ5PSI4cHgiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIiAvPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTggOUM4LjAwMDA0IDIyLjk0OTQgMTYuMjA5OSAyOCAyNyAyOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgLz48Y2lyY2xlIHN0eWxlPSJ0cmFuc2Zvcm06dHJhbnNsYXRlM2QoOHB4LCAxNC4yNXB4LCAwcHgpIiBjeD0iMHB4IiBjeT0iMHB4IiByPSI0cHgiIGZpbGw9IndoaXRlIi8+PC9nPjwvc3ZnPg=="}}

export default function PoolDetail() {
  const [ t ] = useTranslation()
  const { account } = useActiveWeb3React()
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens
      })),
    [trackedTokenPairs]
  )

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )
  const [v2PairsBalances, fetchingV2PairBalances] =
    useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens)

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens)
  )
  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))


  const pair = allV2PairsWithLiquidity?.[0]

  if (!pair) {
    return null
  }

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  return (
    <PageWrapper>
      <AutoColumn gap='md'>
        <AutoColumn gap='sm'>
          <Link
            style={{
              textDecoration: 'none',
              width: 'fit-content',
              marginBottom: '0.5rem'
            }}
            to='/pool'>
            <HoverText>{'← Back to Pools Overview'}</HoverText>
          </Link>
          {/* <ResponsiveRow>
            <RowFixed>
              <DoubleCurrencyLogo
                currency0={currency0}
                currency1={currency1}
                size={24}
                margin={true}
              />
              <TYPE.label fontSize={'24px'} mr='10px'>
                &nbsp;{currency0?.symbol}&nbsp;/&nbsp;{currency1?.symbol}
              </TYPE.label>
            </RowFixed>
            <RowFixed>
              <ButtonGray
                as={Link}
                to={`/increase/${currencyId(currency0)}/${currencyId(
                  currency1
                )}/1/2`}
                width='fit-content'
                padding='6px 8px'
                borderRadius='12px'
                style={{ marginRight: '8px' }}>
                {t('Increase Liquidity')}
              </ButtonGray>
              <ResponsiveButtonPrimary
                as={Link}
                to={`/remove/1111`}
                width='fit-content'
                padding='6px 8px'
                borderRadius='12px'>
                {t('Remove Liquidity')}
              </ResponsiveButtonPrimary>
              <ButtonGray
                as={Link}
                to={`/increase/${currencyId(currency0)}/${currencyId(
                  currency1
                )}/1/2`}
                width='fit-content'
                padding='6px 8px'
                borderRadius='12px'
                style={{ marginLeft: '8px' }}>
                {t('Mining')}
              </ButtonGray>
            </RowFixed>
          </ResponsiveRow>
          <RowBetween></RowBetween> */}
        </AutoColumn>
        <ResponsiveRow align='flex-start'>
          <DarkCard
            width='100%'
            height='100%'
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-around',
              marginRight: '12px'
            }}>
            <div style={{ marginRight: 12 }}>
              <NFT image={metadata.result.image} height={400} />
            </div>
          </DarkCard>
          <AutoColumn gap='sm' style={{ width: '100%', height: '100%' }}>
            <LiquidityInfo pair={pair} />
            <PriceInfo pair={pair} />
          </AutoColumn>
        </ResponsiveRow>
      </AutoColumn>
    </PageWrapper>
  )
}
