import { ISong, ISongDetail } from './models'

export interface IResponse<T> {
  code: string
  data: T
}

export type ISongListResponse = IResponse<{
  list: ISong[]
}>

export type ISongDetailResponse = IResponse<ISongDetail>