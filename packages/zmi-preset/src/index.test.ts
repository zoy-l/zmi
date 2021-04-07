import fs from 'fs'

import index from '.'

test('preset', () => {
  const commands = fs.readdirSync(`${__dirname}/plugins/commands`)

  const features = fs.readdirSync(`${__dirname}/plugins/features`)

  expect(['registerMethods', ...commands, ...features].length).toEqual(
    index().plugins.length
  )
})
