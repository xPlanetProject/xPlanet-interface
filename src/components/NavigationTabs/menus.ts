import * as i18n from 'i18n'
import { v4 } from 'uuid'

export type MenuItem = {
  id: string
  linkId: string
  to: string
  text: string
  isActive: boolean
}

const getMenus = (t: i18n.default.TFunction | any, active: string): Array<MenuItem> => {
  return [
    {
      id: v4(),
      linkId: 'swap-nav-link',
      to: '/swap',
      text: t('swap'),
      isActive: active === 'swap'
    },
    {
      id: v4(),
      linkId: 'pool-nav-link',
      to: '/pool',
      text: t('pool'),
      isActive: active === 'pool'
    },
    {
      id: v4(),
      linkId: 'yield-nav-link',
      to: '/yield',
      text: t('yield'),
      isActive: active === 'yield'
    },
    {
      id: v4(),
      linkId: 'xmoon-nav-link',
      to: '/xmoon',
      text: t('xmoon'),
      isActive: active === 'xmoon'
    },
    {
      id: v4(),
      linkId: 'marketpalce-nav-link',
      to: '/marketpalce',
      text: t('marketpalce'),
      isActive: active === 'marketpalce'
    },
    {
      id: v4(),
      linkId: 'launchpad-nav-link',
      to: '/launchpad',
      text: t('launchpad'),
      isActive: active === 'launchpad'
    },
    {
      id: v4(),
      linkId: 'xnova-nav-link',
      to: '/xnova',
      text: t('xnova'),
      isActive: active === 'xnova'
    }
  ]
}

export default getMenus
