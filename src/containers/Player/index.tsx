import * as React from 'react'
import { Progress } from 'src/components'
import { StoreContext, actions } from 'src/store'
import { ApiService } from 'src/services'
import { ISong, ISongDetail, ISongDetailResponse } from 'src/types'
import { Bool } from 'src/config'
import Lyric from './Lyric'
import classNames from 'classnames'
import classes from './Player.scss'

interface IPlayerProps {
  playingSong: ISong | null
}

interface IPlayerState {
  playing: boolean
  mini: boolean
  currentTime: number
  duration: number
  lyricUrl: string
}

class Player extends React.Component<IPlayerProps, IPlayerState> {

  public static contextType = StoreContext
  public readonly context: React.ContextType<typeof StoreContext>
  private readonly audio: React.RefObject<HTMLAudioElement>

  constructor(props: any) {
    super(props)
    this.audio = React.createRef()
    this.state = {
      playing: false,
      mini: true,
      currentTime: 0,
      duration: 0,
      lyricUrl: '',
    }
  }

  public render() {
    const playingSong: Partial<ISong> = this.props.playingSong || {}
    const { mini, currentTime, duration, playing, lyricUrl } = this.state
    const audio = this.renderPlayerAudio(playingSong)
    const currentTimeText = this.formatTime(currentTime)
    const durationText = this.formatTime(duration)
    const playerCls = classNames(classes.player, mini && classes.mini)
    const miniStatusCls = classNames(!mini && classes.hidden)
    const normalStatusCls = classNames(classes.content, mini && classes.hidden)
    const iconPlayCls = classNames(
      'iconfont', 
      classes.iconPlay, 
      playing ? 'icon-pause' : 'icon-play',
    )
    return (
      <div className={playerCls}>
        {audio}
        <div 
          onClick={this.toggleMiniStatus}
          className={miniStatusCls}>
          <span>{currentTimeText}</span>
        </div>
        <div className={normalStatusCls}>
          <div className={classes.closeWrapper}>
            <span onClick={this.toggleMiniStatus}>X</span>
          </div>
          <h3 className={classes.songName}>
            {playingSong.title}
          </h3>
          <div className={classes.lyric}>
            <Lyric lyricUrl={lyricUrl} />
          </div>
          <div className={classes.progress}>
            <span>{currentTimeText}</span>
            <Progress total={duration} current={currentTime} />
            <span>{durationText}</span>
          </div>
          <div className={classes.toolbar}>
            <span 
              className='iconfont icon-prev' 
              onClick={this.playPrevSong}
            />
            <span 
              className={iconPlayCls} 
              onClick={this.togglePlayStatus}
            />
            <span 
              className='iconfont icon-next' 
              onClick={this.playNextSong}
            />
          </div>
        </div>
      </div>
    )
  }

  public componentDidUpdate(prevProps: IPlayerProps, prevState: IPlayerState) {
    const { playingSong } = this.props
    const { playing } = this.state
    if (playingSong !== prevProps.playingSong) {
      this.setState({
        playing: true, 
        currentTime: 0,
      })
      this.fetchSongDetail()
    } else if (prevState.playing !== playing) {
      const audio = this.audio.current as HTMLAudioElement
      playing ? audio.play() : audio.pause()
    }
  }

  private renderPlayerAudio(playingSong: Partial<ISong>) {
    const songUrl = this.getSongInfo(playingSong.song_list)
    return (
      <audio
        autoPlay={true}
        src={songUrl as string}
        ref={this.audio}
        onLoadedData={this.handleLoadedData}
        onTimeUpdate={this.handleTimeChange}
      />
    )
  }

  private handleLoadedData = (evt: React.SyntheticEvent) => {
    const { duration } = evt.target as HTMLAudioElement
    this.setState({ 
      duration: Math.floor(duration),
    })
  }

  private handleTimeChange = (evt: React.SyntheticEvent) => {
    const audio = evt.target as HTMLAudioElement
    const newTime = Math.floor(audio.currentTime)
    const { currentTime } = this.state
    if (newTime !== currentTime) {
      this.setState({ 
        currentTime: newTime, 
      })
    }
  }

  private playPrevSong = () => {
    const { songs } = this.context
    const { playingSong } = this.props
    const index = songs.findIndex(song => song.id === (playingSong as ISong).id)
    if (index === -1 || index === 0) {
      actions.store.setStore({ 
        playingSong: songs[songs.length - 1],
      })
    } else {
      actions.store.setStore({ 
        playingSong: songs[index - 1],
      })
    }
  }

  private playNextSong = () => {
    const { songs } = this.context
    const { playingSong } = this.props
    const index = songs.findIndex(song => song.id === (playingSong as ISong).id)
    if (index === -1 || index === (songs.length - 1)) {
      actions.store.setStore({ 
        playingSong: songs[0],
      })
    } else {
      actions.store.setStore({ 
        playingSong: songs[index + 1],
      })
    }
  }

  private formatTime(time: number) {
    const minutes = Math.floor(time / 60)
    const seconds = time - minutes * 60
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${pad(minutes)}:${pad(seconds)}`
  }

  private fetchSongDetail = async () => {
    try {
      const { playingSong } = this.props
      const service = new ApiService<ISongDetailResponse>('song')
      const songId = this.getSongInfo(
        (playingSong as ISong).song_list, 'song_id'
      )
      const result = await service.get({
        path: 'detail',
        data: { id: songId, is_login: Bool.No }
      })
      this.setState({ lyricUrl: result.data.lyric_url })
    } catch (error) {
      console.log(error)
    }
  }

  private getSongInfo(songList: ISongDetail[] | undefined, key: keyof ISongDetail = 'song_url') {
    if (!songList || songList.length === 0) {
      return undefined 
    }
    return songList[0][key]
  }

  private togglePlayStatus = () => {
    this.setState(({ playing }, { playingSong }) => {
      return {
        playing: playingSong ? !playing : false,
      }
    })
  }

  private toggleMiniStatus = () => {
    this.setState(({ mini }) => {
      return {
        mini: !mini,
      }
    })
  }

}

export default Player