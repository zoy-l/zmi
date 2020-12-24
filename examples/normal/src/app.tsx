import React, { useState } from 'react'
import styles from './index.css'

const App = () => {
  const [num, setNum] = useState(0)
  return (
    <div
      className={styles.hello}
      onClick={() => {
        setNum(num - 3)
      }}
    >
      {num}
    </div>
  )
}

export default App
