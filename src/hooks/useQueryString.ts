import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { parse } from 'querystring'

export default function useQueryString() {
  const location = useLocation()
  const ref = useRef(parse(location.search.substr(1)))

  useEffect(() => {
    ref.current = parse(location.search.substr(1))
  }, [location])

  return ref.current
}
