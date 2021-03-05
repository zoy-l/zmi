// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { printFileSizesAfterBuild, measureFileSizesBeforeBuild } from './reporterFileSize'
import { lodash } from '@zmi-cli/utils'
import stripAnsi from 'strip-ansi'
import path from 'path'

const state = {
  assetsByChunkName: { main: ['main.86a8dd21.css', 'main.abc02671.js'] },
  assets: [
    {
      type: 'asset',
      name: 'main.abc02671.js',
      size: 132365,
      emitted: true,
      comparedForEmit: false,
      cached: false,
      info: {
        immutable: true,
        contenthash: 'abc02671',
        javascriptModule: false,
        minimized: true,
        size: 132365
      },
      chunkNames: ['main'],
      chunkIdHints: [],
      auxiliaryChunkNames: [],
      auxiliaryChunkIdHints: []
    },
    {
      type: 'asset',
      name: 'chunk.abc02671.js',
      size: 132365,
      emitted: true,
      comparedForEmit: false,
      cached: false,
      info: {
        immutable: true,
        contenthash: 'abc02671',
        javascriptModule: false,
        minimized: true,
        size: 132365
      },
      chunkNames: ['chunk'],
      chunkIdHints: [],
      auxiliaryChunkNames: [],
      auxiliaryChunkIdHints: []
    },
    {
      type: 'asset',
      name: 'index.html',
      size: 3219,
      emitted: true,
      comparedForEmit: false,
      cached: false,
      info: { size: 3219 },
      chunkNames: [],
      chunkIdHints: [],
      auxiliaryChunkNames: [],
      auxiliaryChunkIdHints: []
    },
    {
      type: 'asset',
      name: 'img/logo.103b5fa1.svg',
      size: 2671,
      emitted: true,
      comparedForEmit: false,
      cached: false,
      info: { immutable: true, sourceFilename: 'src/logo.svg', size: 2671 },
      chunkNames: [],
      chunkIdHints: [],
      auxiliaryChunkNames: ['main'],
      auxiliaryChunkIdHints: []
    },
    {
      type: 'asset',
      name: 'main.86a8dd21.css',
      size: 478,
      emitted: true,
      comparedForEmit: false,
      cached: false,
      info: { immutable: true, contenthash: '86a8dd21', minimized: true, size: 478 },
      chunkNames: ['main'],
      chunkIdHints: [],
      auxiliaryChunkNames: [],
      auxiliaryChunkIdHints: []
    }
  ]
}

const fixtures = path.join(__dirname, '../fixtures/reporter-file-size')

const cacheLog = console.log

beforeEach(() => {
  window.console.log = jest.fn()
})

afterEach(() => {
  window.console.log = cacheLog
})

test('reporter file size null', () => {
  const sizes = { 'main.css': 304, 'main.js': 123007 }
  const _state = lodash.cloneDeep(state)

  _state.assets = undefined
  printFileSizesAfterBuild(_state, sizes, fixtures)
})

test('reporter file size green', () => {
  const sizes = { 'main.css': 304, 'main.js': 123007 }
  printFileSizesAfterBuild(state, sizes, fixtures)

  expect(console.log.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
    '➜  reporter-file-size/main.abc02671.js  129.26 KB (+9.14 KB) ',
    '➜  reporter-file-size/chunk.abc02671.js  129.26 KB            ',
    '➜  reporter-file-size/main.86a8dd21.css  478 B (+174 B)       '
  ])
})

test('reporter file size yellow', () => {
  const sizes = { 'main.css': 50, 'main.js': 43007 }
  printFileSizesAfterBuild(state, sizes, fixtures)

  expect(console.log.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
    '➜  reporter-file-size/main.abc02671.js  129.26 KB (+87.26 KB) ',
    '➜  reporter-file-size/chunk.abc02671.js  129.26 KB             ',
    '➜  reporter-file-size/main.86a8dd21.css  478 B (+428 B)        '
  ])
})

test('reporter file size red', () => {
  const sizes = { 'main.css': 1024, 'main.js': 100 }
  printFileSizesAfterBuild(state, sizes, fixtures)

  expect(console.log.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
    '➜  reporter-file-size/main.abc02671.js  129.26 KB (+129.17 KB) ',
    '➜  reporter-file-size/chunk.abc02671.js  129.26 KB              ',
    '➜  reporter-file-size/main.86a8dd21.css  478 B (-546 B)         '
  ])
})

test('main suggest bundle splitting', () => {
  const sizes = { 'main.css': 1024, 'main.js': 100 }
  const _state = lodash.cloneDeep(state)
  _state.assets[0].size = 524289
  printFileSizesAfterBuild(_state, sizes, fixtures)

  expect(console.log.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
    '➜  reporter-file-size/main.abc02671.js  512 KB (+511.9 KB) ',
    '➜  reporter-file-size/chunk.abc02671.js  129.26 KB          ',
    '➜  reporter-file-size/main.86a8dd21.css  478 B (-546 B)     ',
    undefined,
    'The bundle size is significantly larger than recommended.',
    'You can also analyze the project dependencies: https://webpack.js.org/guides/code-splitting/'
  ])
})

test('chunk suggest bundle splitting', () => {
  const sizes = { 'main.css': 1024, 'main.js': 100 }
  const _state = lodash.cloneDeep(state)
  _state.assets[1].size = 1048577
  printFileSizesAfterBuild(_state, sizes, fixtures)

  expect(console.log.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
    '➜  reporter-file-size/chunk.abc02671.js  1 MB                   ',
    '➜  reporter-file-size/main.abc02671.js  129.26 KB (+129.17 KB) ',
    '➜  reporter-file-size/main.86a8dd21.css  478 B (-546 B)         ',
    undefined,
    'The bundle size is significantly larger than recommended.',
    'You can also analyze the project dependencies: https://webpack.js.org/guides/code-splitting/'
  ])
})

test('measure file sizes before build error', async () => {
  await expect(measureFileSizesBeforeBuild(`${fixtures}/error`)).rejects.toThrow(/ENOENT/)
})
