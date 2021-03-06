// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { printFileSizesAfterBuild, measureFileSizesBeforeBuild } from './reporterFileSize'
import { rmdirSync } from 'fs-extra'
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
  const sizes = { 'main.css': 304, 'main.js': 523007 }
  printFileSizesAfterBuild(state, sizes, fixtures)

  expect(console.log.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
    '➜  reporter-file-size/main.abc02671.js  492.91 KB (-17.84 KB) ',
    '➜  reporter-file-size/chunk.abc02671.js  82.99 KB              ',
    '➜  reporter-file-size/main.86a8dd21.css  304 B                 '
  ])
})

test('reporter file size yellow', () => {
  const sizes = { 'main.css': 50, 'main.js': 443007 }
  printFileSizesAfterBuild(state, sizes, fixtures)

  expect(console.log.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
    '➜  reporter-file-size/main.abc02671.js  492.91 KB (+60.28 KB) ',
    '➜  reporter-file-size/chunk.abc02671.js  82.99 KB              ',
    '➜  reporter-file-size/main.86a8dd21.css  304 B (+254 B)        '
  ])
})

test('reporter file size red', () => {
  const sizes = { 'main.css': 1024, 'main.js': 100 }
  printFileSizesAfterBuild(state, sizes, fixtures)

  expect(console.log.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
    '➜  reporter-file-size/main.abc02671.js  492.91 KB (+492.81 KB) ',
    '➜  reporter-file-size/chunk.abc02671.js  82.99 KB               ',
    '➜  reporter-file-size/main.86a8dd21.css  304 B (-720 B)         '
  ])
})

const state2 = {
  assetsByChunkName: { main: ['main.abc02671.js'] },
  assets: [
    {
      type: 'asset',
      name: 'main.abc02672.js',
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
      name: 'chunk.abc02672.js',
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
    }
  ]
}

test('main suggest bundle splitting', () => {
  const sizes = { 'main.css': 1024, 'main.js': 1000 }
  printFileSizesAfterBuild(state2, sizes, fixtures)

  expect(console.log.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
    '➜  reporter-file-size/main.abc02672.js  599.36 KB (+598.38 KB) ',
    '➜  reporter-file-size/chunk.abc02672.js  599.36 KB              ',
    undefined,
    'The bundle size is significantly larger than recommended.',
    'You can also analyze the project dependencies: https://webpack.js.org/guides/code-splitting/'
  ])
})

test('chunk suggest bundle splitting', () => {
  const sizes = { 'main.css': 1024, 'main.js': 600000 }
  printFileSizesAfterBuild(state2, sizes, fixtures)

  expect(console.log.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
    '➜  reporter-file-size/main.abc02672.js  599.36 KB (+13.42 KB) ',
    '➜  reporter-file-size/chunk.abc02672.js  599.36 KB             ',
    undefined,
    'The bundle size is significantly larger than recommended.',
    'You can also analyze the project dependencies: https://webpack.js.org/guides/code-splitting/'
  ])
})

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000))
test('measure file sizes before build error', async () => {
  expect(Object.keys(measureFileSizesBeforeBuild(`${fixtures}/error`)).length).toEqual(0)
  await wait()
  rmdirSync(`${fixtures}/error`)
})
