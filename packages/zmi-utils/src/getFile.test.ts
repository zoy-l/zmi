import getFile from './getFile'
import path from 'path'

test('getFile', () => {
  const file = getFile({
    fileNameWithoutExt: 'index',
    type: 'javascript',
    base: __dirname
  })

  expect(file).toEqual({ paths: `${__dirname}/index.ts`, filename: 'index.ts' })
})

test('getFile css', () => {
  const cwd = path.join(__dirname, '../fixtures')
  const file1 = getFile({
    fileNameWithoutExt: 'getFile',
    type: 'css',
    base: cwd
  })

  expect(file1).toEqual({ paths: `${cwd}/getFile.css`, filename: 'getFile.css' })
})

test('getFile null', () => {
  const file1 = getFile({
    fileNameWithoutExt: 'getFile',
    type: 'css',
    base: __dirname
  })

  expect(file1).toEqual(null)
})
