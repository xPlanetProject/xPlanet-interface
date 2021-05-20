import React from 'react'
import { Link } from 'react-router-dom'
import { AutoColumn } from '@/components/Column'

export default function PoolListItme({ data }: { data: Object }) {
  console.log(data)
  // console.log(data.id)

  return (
    <>
      <AutoColumn as={Link} to={`/yield/`}>
        item
      </AutoColumn>
    </>
  )
}
