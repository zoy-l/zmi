import path from 'path'
import withEvn from './withEnv'

const fixtures = path.join(__dirname, '../fixtures')

test('env', () => {
  process.env.APP_ROOT = 'lib'
  const cwd = path.join(fixtures, 'withEvn/.env')
  withEvn(cwd)
  expect(process.env.APP_ROOT).toEqual('lib')
  expect(process.env.NODE_ENV).toEqual('test')
  expect(process.env.PORT).toEqual('8080')
})

test('env-empty', () => {
  const cwd = path.join(fixtures, 'withEvn/.env.local')
  withEvn(cwd)
  expect(process.env.LOCAL).toEqual('test')
})
