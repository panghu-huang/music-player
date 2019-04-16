import * as React from 'react'
import { ApiService } from 'src/services'
import { actions } from 'src/store'
import { ISong, ISongListResponse } from 'src/types'
import Song from '../Song'
import classes from './SongList.scss'

interface ISongListProps {
  songs: ISong[]
}

interface ISongListState {
  songs: ISong[]
}

class SongList extends React.Component<ISongListProps, ISongListState> {

  public static defaultProps = {
    songs: [],
  }

  public static getDerivedStateFromProps(nextProps: ISongListProps, prevState: ISongListState) {
    if (nextProps.songs.length && !prevState.songs.length) {
      return {
        songs: nextProps.songs,
      }
    }
    return null
  }

  public static async getInitialProps(recommendTime?: string) {
    const service = new ApiService<ISongListResponse>('weibo')
    const data = await service.get({
      path: 'info/list',
      data: {
        page_size: 20,
        type: 'recommend',
        recommend_time: recommendTime,
      },
    })
    return {
      songs: data.data.list,
    }
  }

  constructor(props: ISongListProps) {
    super(props)
    this.state = {
      songs: [],
    }
  }

  public render() {
    const { songs } = this.state
    return (
      <div className={classes.songList}>
        {songs.map(song => {
          return (
            <Song key={song.id} song={song} />
          )
        })}
      </div>
    )
  }

  public componentDidMount() {
    // 服务器渲染第一次可能不走 componentDidUpdate
    actions.store.setStore({
      songs: this.state.songs,
    })
  }

  public componentDidUpdate(prevProps: ISongListProps, prevState: ISongListState) {
    const { songs } = this.state
    if (prevState.songs.length !== songs.length) {
      actions.store.setStore({
        songs,
      })
    }
  }

}

export default SongList