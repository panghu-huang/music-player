import * as React from 'react'
import classes from './Progress.scss'

interface IProgressProps {
  total: number
  current: number
}

const Progress: React.SFC<IProgressProps> = ({ total, current }) => {
  const width = total ? `${+(current / total).toFixed(2) * 100}%` : 0
  return (
    <div className={classes.container}>
      <div style={{ width }} className={classes.inner}/>
    </div>
  )
}

export default Progress