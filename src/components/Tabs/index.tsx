import * as React from 'react'
import TabContext, { ITabStore, ITabOptions } from './TabContext'
import TabPane from './TabPane'
import TabTitle from './TabTitle'

interface ITabsProps {
  children: React.ReactNode
  defaultActiveKey?: string
  onChange?: (tabKey: string) => void
}

class Tabs extends React.PureComponent<ITabsProps, ITabStore> {

  public static Pane = TabPane

  constructor(props: ITabsProps) {
    super(props)
    this.state = {
      currentTabKey: props.defaultActiveKey || null,
      tabs: [],
      addTab: this.addTab,
      changeTab: this.changeTab,
    }
  }

  public render() {
    return (
      <TabContext.Provider value={this.state}>
        <TabTitle tabs={this.state.tabs} />
        {this.props.children}
      </TabContext.Provider>
    )
  }

  private addTab = (tab: ITabOptions) => {
    this.setState(({ tabs, currentTabKey }) => {
      return {
        currentTabKey: tabs.length ? currentTabKey : tab.tabKey,
        tabs: tabs.concat(tab),
      }
    })
  }

  private changeTab = (key: string) => {
    this.setState({ currentTabKey: key })
  }

}

export default Tabs