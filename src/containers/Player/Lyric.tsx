import * as React from 'react'

interface ILyricProps {
  lyricUrl: string | undefined
}

const Lyric: React.FunctionComponent<ILyricProps> = ({ lyricUrl }) => {
  const [content, setContent] = React.useState(null as React.ReactNode)
  React.useEffect(() => {
    if (!lyricUrl) {
      return
    }
    fetch(lyricUrl)
      .then(response => response.text())
      .then(lyric => {
        const content = lyric.split('\n').map((line, index) => {
          return (
            <p key={index}>{line}</p>
          )
        })
        setContent(content)
      })
  }, [lyricUrl])
  return (
    <>{content}</>
  )
}

export default React.memo(Lyric)
