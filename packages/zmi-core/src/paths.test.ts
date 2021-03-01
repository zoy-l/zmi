import { lodash, winPath } from '@zmi-cli/utils'
import { join, relative } from 'path'

import { IServicePaths } from './types'
import paths from './paths'

const fixtures = join(__dirname, '../fixtures')

function stripCwd(paths: IServicePaths, cwd: string) {
  return lodash.mapValues(paths, (value) =>
    value.startsWith('@') ? value : winPath(relative(cwd, value))
  )
}

test('empty', () => {
  const cwd = join(fixtures, 'getPaths-empty')
  expect(
    stripCwd(
      paths({
        cwd,
        config: {},
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
        config: {},
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

test('empty config singular', () => {
  const cwd = join(fixtures, 'getPaths-empty')
  expect(
    stripCwd(
      paths({
        cwd,
        config: {
          singular: true
        },
        env: 'development'
      }),
      cwd
    )
  ).toEqual({
    appNodeModulesPath: 'node_modules',
    appOutputPath: 'dist',
    appPagesPath: 'page',
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
        config: {},
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

test('src config singular', () => {
  const cwd = join(fixtures, 'getPaths-with-src')
  expect(
    stripCwd(
      paths({
        cwd,
        config: {
          singular: true
        },
        env: 'development'
      }),
      cwd
    )
  ).toEqual({
    appNodeModulesPath: 'node_modules',
    appOutputPath: 'dist',
    appPagesPath: 'src/page',
    appSrcPath: 'src',
    cwd: ''
  })
})
