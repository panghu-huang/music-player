import * as React from 'react'
import TabContext, { ITabOptions } from '../TabContext'
import classNames from 'classnames'
import classes from './TabTitle.scss'

interface ITabTitleProps {
  tabs: ITabOptions[]
}

class TabTitle extends React.Component<ITabTitleProps> {

  public static contextType = TabContext
  public readonly context: React.ContextType<typeof TabContext>

  public render() {
    const { currentTabKey } = this.context
    const { tabs } = this.props
    return (
      <div className={classes.container}>
        {tabs.map(tab => {
          const cls = classNames(
            classes.title,
            currentTabKey === tab.tabKey && classes.current,
          )
          return (
            <span
              key={tab.tabKey}
              className={cls}
              onClick={this.changeTab(tab.tabKey)}>
              {tab.title}
            </span>
          )
        })}
      </div>
    )
  }

  private changeTab(key: string) {
    return () => this.context.changeTab(key)
  }

}

export default TabTitle