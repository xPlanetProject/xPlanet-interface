import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import getMenus, { MenuItem } from './menus'

export function SwapPoolTabsMobile({ active }: { active: string }) {

  const { t } = useTranslation()

  const menus: Array<MenuItem> = useMemo<Array<MenuItem>>(() => {
    return getMenus(t, active)
  }, [t, active])

  console.log(menus)

  return (
    <div>Mobile Menu</div>
  )
}