import { slash } from '@zmi-cli/utils'
import getFile from './getFile'
import path from 'path'

test('getFile', () => {
  const file = getFile({
    fileNameWithoutExt: 'index',
    type: 'javascript',
    base: __dirname
  })!
  file.paths = slash(file.paths)
  expect(file).toEqual({ paths: slash(`${__dirname}/index.ts`), filename: 'index.ts' })
})

test('getFile css', () => {
  const cwd = path.join(__dirname, '../fixtures')
  const file1 = getFile({
    fileNameWithoutExt: 'getFile',
    type: 'css',
    base: cwd
  })!
  file1.paths = slash(file1.paths)
  expect(file1).toEqual({ paths: slash(`${cwd}/getFile.css`), filename: 'getFile.css' })
})

test('getFile null', () => {
  const file1 = getFile({
    fileNameWithoutExt: 'getFile',
    type: 'css',
    base: __dirname
  })

  expect(file1).toEqual(null)
})
