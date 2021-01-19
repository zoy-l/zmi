import React from 'react'
import { render } from 'react-dom'

import App from './app'

document.addEventListener('DOMContentLoaded', () => {
  render(
    <App />,
    document.getElementById('root')
  )
})
