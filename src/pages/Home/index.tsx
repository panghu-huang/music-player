import * as React from 'react'
import { Tabs } from 'src/components'
import { SongList } from 'src/containers'
import { ISong } from 'src/types'

interface IHomeProps {
  songs: ISong[]
}

class Home extends React.Component<IHomeProps> {

  public static async getInitialProps() {
    const { songs } = await SongList.getInitialProps()
    return {
      songs,
    }
  }

  public render() {
    const { songs } = this.props
    return (
      <Tabs defaultActiveKey='recommend'>
        <Tabs.Pane tabKey='recommend' title='推荐'>
          <SongList songs={songs}/>
        </Tabs.Pane>
        <Tabs.Pane tabKey='newest' title='最新'>
          最新列表
        </Tabs.Pane>
      </Tabs>
    )
  }

}

export default Home