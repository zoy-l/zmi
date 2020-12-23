import React, { useState } from 'react'

const App = () => {
  const [num, setNum] = useState(0)
  return (
    <div
      onClick={() => {
        setNum(num - 3)
      }}
    >
      {num}
    </div>
  )
}

export default App
