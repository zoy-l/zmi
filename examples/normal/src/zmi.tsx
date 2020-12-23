import React from 'react'
import { render } from 'react-dom'
import './index.css'

document.addEventListener('DOMContentLoaded', () => {
  render(
    <React.StrictMode>
      <div>hello zmi</div>
    </React.StrictMode>,
    document.getElementById('root')
  )
})
