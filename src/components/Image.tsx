import * as React from 'react'
import { Utils } from 'src/utils'

interface ILazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholder: string
}

interface ILazyImageState {
  source: string
}

class LazyImage extends React.PureComponent<ILazyImageProps, ILazyImageState> {

  public static defaultProps = {
    placeholder: 'https://react.semantic-ui.com/images/wireframe/square-image.png',
  }

  private readonly image: React.RefObject<HTMLImageElement>
  private readonly scrollHandler: (evt: UIEvent) => void

  constructor(props: ILazyImageProps) {
    super(props)
    this.image = React.createRef()
    this.state = {
      source: props.placeholder,
    }
    this.scrollHandler = Utils.throttle(
      this.handleWindowScroll.bind(this), 
      500
    )
  }

  public componentDidMount() {
    // 防止在计算 rem 之前，获取的位置不准确
    process.nextTick(() => {
      if (this.checkImageVisible()) {
        this.setState({
          source: this.props.src as string,
        })
      } else {
        window.addEventListener('scroll', this.scrollHandler)
      }
    })
  }

  public render() {
    const { placeholder, ...imgProps } = this.props
    return (
      <img
        {...imgProps}
        src={this.state.source}
        ref={this.image}
      />
    )
  }

  public componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler)
  }

  private handleWindowScroll() {
    if (this.checkImageVisible()) {
      this.setState({
        source: this.props.src as string,
      })
      window.removeEventListener('scroll', this.scrollHandler)
    }
  }

  private checkImageVisible = () => {
    const element = this.image.current as HTMLImageElement
    const { top, height } = element.getBoundingClientRect()
    const { clientHeight } = document.documentElement
    return top >= -height && top <= clientHeight
  }

}

export default LazyImage