import { Bool } from 'src/config'

export interface ISong {
  id: string
  type: string
  title: string
  price: string
  time: string
  createTime: string
  user_id: string
  user_name: string
  user_type: string
  user_img_url: string
  user_introduction: string
  back_ground_img_url: string
  song_list: ISongDetail[]
  musician_name: string
  musician_id: string
  view_num: number
  recommend_time: string
  praise_num: number
  share_num: number
  comment_num: number
  is_free: Bool
  is_praise: Bool
  is_recommend: Bool
  is_station: Bool
}

export interface ISongDetail {
  song_id: string
  musican_name: string
  design_notes: string
  comment_num: number
  gift_num: number
  lyric_url: string
  song_name: string
  song_url: string
  disc_img_url: string
  musican_id: string
  is_collected: Bool
  disc_id: string
  mv_id: string | null
  weibo_id: string
}