import { useEffect, useRef } from 'react'
import isEqual from 'lodash/isEqual'

export function useAsyncMemo<T = any>(callback: () => T, deps: Array<any>): T | undefined {
  const result = useRef<T | undefined>(undefined)
  const lastDep = useRef<Array<any>>([])

  useEffect(() => {
    if (!isEqual(deps, lastDep.current)) {
      lastDep.current = deps
      const excuteCallback = async () => {
        const lastestState = await callback()
        result.current = lastestState
      }

      excuteCallback()
    }
  }, [deps, lastDep, result])

  return result.current
}
