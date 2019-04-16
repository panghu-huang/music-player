import { genStorer } from 'react-storer'
import { IStore } from 'src/types'

const initialState = {
  playingSong: null,
  songs: [],
}

export const store = genStorer<IStore, {}>(initialState, {})

export const StoreContext = store.genContext()

export const actions = store.genActions()