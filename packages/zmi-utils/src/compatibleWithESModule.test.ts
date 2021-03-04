import path from 'path'
import compatibleWithESModule from './compatibleWithESModule'

test('module', async () => {
  const cwd = path.join(__dirname, '../fixtures')
  const module = compatibleWithESModule(require(`${cwd}/module.js`))
  const _export = compatibleWithESModule(await import(`${cwd}/export.js`))

  expect(module).toEqual(_export)
})

test('module null', () => {
  const module = compatibleWithESModule({ __esModule: true, default: null })

  expect(module).toEqual(null)
})
