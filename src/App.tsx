import * as React from 'react'
import { AppProps, Params } from 'server-renderer'
import { Player } from 'src/containers'
import { StoreContext, store } from 'src/store'
import { IStore } from 'src/types'

type Props = AppProps<{ data: any }>

interface IAppState {
  store: IStore
}

class App extends React.Component<Props, IAppState> {

  public static async getInitialProps(params: Params) {
    if (params.Component && params.Component.getInitialProps) {
      const data = await params.Component.getInitialProps(params)
      return {
        data,
      }
    }
    return {
      data: {},
    }
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      store: {
        playingSong: null,
        songs: [],
      },
    }
    store.bindSetStore(this.setState.bind(this))
  }

  public componentDidMount() {
    this.calculateHtmlFontSize()
  }

  public render() {
    const { Component, data } = this.props
    const { store } = this.state
    return (
      <StoreContext.Provider value={store}>
        <Player playingSong={store.playingSong} />
        <Component {...data} />
      </StoreContext.Provider>
    )
  }

  private calculateHtmlFontSize() {
    const html = document.documentElement as HTMLHtmlElement
    const width = screen.availWidth
    const dpr = window.devicePixelRatio || 1
    const fontSize = 100 * width / 750 * dpr
    html.setAttribute('style', 'font-size:' + fontSize.toFixed(2) + 'px')
    const viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement
    const scale = (1 / dpr).toFixed(2)
    viewport.setAttribute('content', 'width=' + dpr * width + ',initial-scale='
      + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no')
  }

}

export default App