import { ISong } from './models'

export interface IStore {
  playingSong: ISong | null
  songs: ISong[]
}