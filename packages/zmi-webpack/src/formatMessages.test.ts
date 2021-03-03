import path from 'path'

import formatMessage from './formatMessages'

test('formatMessages', () => {
  const cwd = path.join(__dirname, '../fixtures/formatMsg')
  const json = require(`${cwd}/json.js`)
  const state = require(`${cwd}/index.js`)
  const data = formatMessage(state)

  expect(data).toEqual(json)
})
