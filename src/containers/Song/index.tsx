import * as React from 'react'
import { router } from 'server-renderer'
import { Image } from 'src/components'
import { actions } from 'src/store'
import { ISong } from 'src/types'
import classes from './Song.scss'

interface ISongProps {
  song: ISong
}

const Song: React.SFC<ISongProps> = ({ song }) => {
  const playSong = () => actions.store.setStore({ playingSong: song })
  const goToSingerInfo = () => router.push(`/singers/${song.user_id}`)
  return (
    <div key={song.id} className={classes.song}>
      <div
        className={classes.coverWrapper}
        onClick={playSong}>
        <Image
          className={classes.cover}
          src={song.back_ground_img_url}
        />
      </div>
      <h6 className={classes.songName} onClick={playSong}>
        {song.title}
      </h6>
      <div className={classes.info}>
        <div className={classes.singer} onClick={goToSingerInfo}>
          <Image
            className={classes.avatar}
            src={song.user_img_url}
            alt={song.user_name}
          />
          <span className={classes.singerName}>
            {song.user_name}
          </span>
        </div>
        <div className={classes.info}>
          <span className='iconfont icon-praise'>
            {song.praise_num || ''}
          </span>
          <span className='iconfont icon-comment'>
            {song.comment_num || ''}
          </span>
          <span className='iconfont icon-share'>
            {song.share_num || ''}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Song