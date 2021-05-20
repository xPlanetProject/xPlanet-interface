import React from 'react'
import PoolListItme from './PoolListItme'

const poolList: Array<any> = [
  {
    id: 'XKEY-USDT',
    address: '0xa10740ff9FF6852eac84cdcfF9184e1D6d27C057',
    token0: {
      symbol: 'XKEY',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    },
    token1: {
      symbol: 'USDT',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    }
  },
  {
    id: 'XKEY-ETH',
    address: '0xa10740ff9FF6852eac84cdcfF9184e1D6d27C057',
    token0: {
      symbol: 'XKEY',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    },
    token1: {
      symbol: 'ETH',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    }
  }
]

export default function PoolList() {
  return (
    <>
      {poolList.map(item => (
        <PoolListItme data={item} key={item.id} />
      ))}
    </>
  )
}
