import React, { useState } from 'react'
import styles from './index.less'
import './hello.less'

const App = () => {
  const [num, setNum] = useState(0)
  return (
    <div
      className={styles.hello}
      onClick={() => {
        setNum(num - 2)
      }}
    >
      {num}
      asdf
    </div>
  )
}

export default App
