import {slash} from '@zmi-cli/utils'
import { getCwd, getPkg } from './getRoot'

import path from 'path'

test('get cwd', () => {
  const cwd = getCwd()
  expect(process.cwd()).toEqual(cwd)
})

test('get cwd APP_ROOT', () => {
  process.env.APP_ROOT = './src'
  const cwd = getCwd()
  expect(slash(cwd)).toEqual(`${slash(process.cwd())}/src`)

  process.env.APP_ROOT = '/Users/zoy/zmi/packages/zmi/lib'
  const cwd1 = getCwd()
  expect(cwd1).toEqual(`/Users/zoy/zmi/packages/zmi/lib`)
})

test('get pkg', () => {
  const pkg = getPkg(process.cwd())

  const pkgs = require(path.join(process.cwd(), './package.json'))
  expect(pkg).toEqual(pkgs)
})

test('get pkg null', () => {
  const pkg = getPkg('./')

  expect(pkg).toEqual(null)
})
