import React from 'react'
import { render } from 'react-dom'

import App from './app'
import './index.css'

document.addEventListener('DOMContentLoaded', () => {
  render(
    <App />,

    document.getElementById('root')
  )
})
