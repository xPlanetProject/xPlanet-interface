import { ChainId, Token } from '@xplanet/sdk'
import { Tags, TokenInfo, TokenList } from '@xplanet/token-lists'
import DEFAULT_TOKEN_LIST from '@xplanet/default-token-list'

import { UNSUPPORTED_LIST_URLS } from '@/constants/lists'

import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from '@/state'

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo
  public readonly tags: TagInfo[]
  constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
    super(
      tokenInfo.chainId,
      tokenInfo.address,
      tokenInfo.decimals,
      tokenInfo.symbol,
      tokenInfo.name
    )
    this.tokenInfo = tokenInfo
    this.tags = tags
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export type TokenAddressMap = Readonly<
  {
    [chainId in ChainId]: Readonly<{ [tokenAddress: string]: WrappedTokenInfo }>
  }
>

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST: TokenAddressMap = {
  [ChainId.KOVAN]: {},
  [ChainId.RINKEBY]: {},
  [ChainId.ROPSTEN]: {},
  [ChainId.GÖRLI]: {},
  [ChainId.MAINNET]: {}
}

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined'
    ? new WeakMap<TokenList, TokenAddressMap>()
    : null

function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
  return {
    [ChainId.MAINNET]: { ...map1[ChainId.MAINNET], ...map2[ChainId.MAINNET] },
    [ChainId.RINKEBY]: { ...map1[ChainId.RINKEBY], ...map2[ChainId.RINKEBY] },
    [ChainId.ROPSTEN]: { ...map1[ChainId.ROPSTEN], ...map2[ChainId.ROPSTEN] },
    [ChainId.KOVAN]: { ...map1[ChainId.KOVAN], ...map2[ChainId.KOVAN] },
    [ChainId.GÖRLI]: { ...map1[ChainId.GÖRLI], ...map2[ChainId.GÖRLI] },
  }
}

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) return undefined
            return { ...list.tags[tagId], id: tagId }
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? []
      const token = new WrappedTokenInfo(tokenInfo, tags)
      if (tokenMap[token.chainId][token.address] !== undefined)
        throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: token
        }
      }
    },
    { ...EMPTY_LIST }
  )
  listCache?.set(list, map)
  return map
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
  const lists = useAllLists()
  return useMemo(() => {
    if (!urls) return EMPTY_LIST
    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            return combineMaps(allTokens, listToTokenMap(current))
          } catch (error) {
            console.error('Could not show token list due to error', error)
            return allTokens
          }
        }, EMPTY_LIST)
    )
  }, [lists, urls])
}

const TRANSFORMED_DEFAULT_TOKEN_LIST = listToTokenMap(DEFAULT_TOKEN_LIST)

export function useTokenList(url: string | undefined): TokenAddressMap {
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(
    (state) => state.lists.byUrl
  )
  return useMemo(() => {
    if (!url) return EMPTY_LIST
    const current = lists[url]?.current
    if (!current) return EMPTY_LIST
    try {
      return listToTokenMap(current)
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return EMPTY_LIST
    }
  }, [lists, url])
}

export function useSelectedListUrl(): string | undefined {
  return useSelector<AppState, AppState['lists']['selectedListUrl']>(
    (state) => state.lists.selectedListUrl
  )
}

export function useSelectedTokenList(): TokenAddressMap {
  return useTokenList(useSelectedListUrl())
}

export function useSelectedListInfo(): {
  current: TokenList | null
  pending: TokenList | null
  loading: boolean
} {
  const selectedUrl = useSelectedListUrl()
  const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>(
    (state) => state.lists.byUrl
  )
  const list = selectedUrl ? listsByUrl[selectedUrl] : undefined
  return {
    current: list?.current ?? null,
    pending: list?.pendingUpdate ?? null,
    loading: list?.loadingRequestId !== null
  }
}

// returns all downloaded current lists
export function useAllLists(): TokenList[] {
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(
    (state) => state.lists.byUrl
  )

  return useMemo(
    () =>
      Object.keys(lists)
        .map((url) => lists[url].current)
        .filter((l): l is TokenList => Boolean(l)),
    [lists]
  )
}

export function useActiveListUrls(): string[] | undefined {
  return useSelector<AppState, AppState['lists']['activeListUrls']>((state) => state.lists.activeListUrls)?.filter(
    (url) => !UNSUPPORTED_LIST_URLS.includes(url)
  )
}

export function useCombinedActiveList(): TokenAddressMap {
  const activeListUrls = useActiveListUrls()
  const activeTokens = useCombinedTokenMapFromUrls(activeListUrls)
  return combineMaps(activeTokens, TRANSFORMED_DEFAULT_TOKEN_LIST)
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(): TokenAddressMap {
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(UNSUPPORTED_TOKEN_LIST)

  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(UNSUPPORTED_LIST_URLS)

  // format into one token address map
  return useMemo(() => combineMaps(localUnsupportedListMap, loadedUnsupportedListMap), [
    localUnsupportedListMap,
    loadedUnsupportedListMap,
  ])
}
