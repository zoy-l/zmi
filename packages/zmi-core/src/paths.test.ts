import { lodash, slash } from '@zmi-cli/utils'
import { join, relative } from 'path'

import type { IServicePaths } from './types'
import paths from './paths'

const fixtures = join(__dirname, '../fixtures')

function stripCwd(paths: IServicePaths, cwd: string) {
  return lodash.mapValues(paths, (value) =>
    value.startsWith('@') ? value : slash(relative(cwd, value))
  )
}

test('empty', () => {
  const cwd = join(fixtures, 'getPaths-empty')
  expect(
    stripCwd(
      paths({
        cwd,
        env: 'development'
      }),
      cwd
    )
  ).toEqual({
    appNodeModulesPath: 'node_modules',
    appOutputPath: 'dist',
    appPagesPath: 'pages',
    appSrcPath: '',
    cwd: ''
  })
})

test('empty production', () => {
  const cwd = join(fixtures, 'getPaths-empty')
  expect(
    stripCwd(
      paths({
        cwd,
        outputPath: 'dist',
        env: 'production'
      }),
      cwd
    )
  ).toEqual({
    appNodeModulesPath: 'node_modules',
    appOutputPath: 'dist',
    appPagesPath: 'pages',
    appSrcPath: '',
    cwd: ''
  })
})

test('src', () => {
  const cwd = join(fixtures, 'getPaths-with-src')
  expect(
    stripCwd(
      paths({
        cwd,
        outputPath: 'dist',
        env: 'development'
      }),
      cwd
    )
  ).toEqual({
    appNodeModulesPath: 'node_modules',
    appOutputPath: 'dist',
    appPagesPath: 'src/pages',
    appSrcPath: 'src',
    cwd: ''
  })
})
