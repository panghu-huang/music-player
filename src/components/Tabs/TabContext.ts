import { createContext } from 'react'

export interface ITabOptions {
  tabKey: string
  title: string
}

export interface ITabStore {
  currentTabKey: string | null
  tabs: ITabOptions[]
  addTab: (tab: ITabOptions) => void
  changeTab: (tabKey: string) => void
}

export default createContext({} as ITabStore)