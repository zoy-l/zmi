import { filesize, gzipSize, stripAnsi, fsExtra } from '@zmi-cli/utils'

import path from 'path'
import fs from 'fs'

import { printFileSizesAfterBuild, measureFileSizesBeforeBuild } from './reporterFileSize'

const state: Record<string, any> = {
  assetsByChunkName: { main: ['main.86a8dd21.css', 'main.abc02671.js'] },
  assets: [
    {
      name: 'main.abc02671.js',
      size: 132365
    },
    {
      name: 'main.86a8dd21.css',
      size: 478
    }
  ]
}

const fixtures = path.join(__dirname, '../fixtures/reporter-file-size')

beforeEach(() => {
  window.console.log = jest.fn()
})

afterEach(() => {
  jest.resetAllMocks()
})

const FIFTY_KILOBYTES = 1024 * 50

const formatTest = (log: string[]) => {
  const curVariety: number[] = []
  const units: string[] = []
  const logs = log.map((str) => {
    const test = stripAnsi(str[0])
      .replace(/reporter-file-size(\\|\/)/, '')
      .split(' ')
      .filter((t) => {
        if (!t) {
          return false
        }
        if (path.extname(t) === '.js' || path.extname(t) === '.css') {
          return true
        }

        if (!isNaN(Number(t))) {
          return true
        }

        if (t.split('')[0] === '(') {
          curVariety.push(Number(t.split('(')[1]))
        }

        if (t === 'KB' || t === 'B') {
          units.push(t)
        }

        return false
      })

    return test
  })

  units.forEach((unit, i) => {
    if (unit === 'KB') {
      curVariety[i] *= 1024
    }
  })

  return {
    logs,
    curVariety
  }
}

test('reporter file size null', () => {
  const sizes = { 'main.css': 304, 'main.js': 123007 }
  const _state = { ...state }

  _state.assets = undefined
  printFileSizesAfterBuild(_state, sizes, fixtures)
})

test('reporter file size green', () => {
  const sizes = { 'main.css': 306, 'main.js': 523007 }
  printFileSizesAfterBuild(state, sizes, fixtures)

  const received: string[][] = []
  state.assets.forEach((asset: { name: string }) => {
    const fileContents = fs.readFileSync(path.join(fixtures, asset.name))
    const size = gzipSize.sync(fileContents)

    received.push([asset.name, filesize(size).split(' ')[0]])
  })
  // @ts-expect-error test
  const { logs, curVariety } = formatTest(console.log.mock.calls)

  expect(JSON.stringify(received)).toEqual(JSON.stringify(logs))
  expect(curVariety[0] < 0).toEqual(true)
  expect(curVariety[1] < 0).toEqual(true)
})

test('reporter file size yellow', () => {
  const sizes = { 'main.css': 50, 'main.js': 464300 }
  printFileSizesAfterBuild(state, sizes, fixtures)

  const received: string[][] = []
  state.assets.forEach((asset: { name: string }) => {
    const fileContents = fs.readFileSync(path.join(fixtures, asset.name))
    const size = gzipSize.sync(fileContents)

    received.push([asset.name, filesize(size).split(' ')[0]])
  })
  // @ts-expect-error test
  const { logs, curVariety } = formatTest(console.log.mock.calls)

  expect(JSON.stringify(received)).toEqual(JSON.stringify(logs))
  expect(curVariety[0] < FIFTY_KILOBYTES && curVariety[0] > 0).toEqual(true)
  expect(curVariety[1] < FIFTY_KILOBYTES && curVariety[1] > 0).toEqual(true)
})

test('reporter file size red', () => {
  const sizes = { 'main.css': 1024, 'main.js': 243007 }
  printFileSizesAfterBuild(state, sizes, fixtures)

  const received: string[][] = []
  state.assets.forEach((asset: { name: string }) => {
    const fileContents = fs.readFileSync(path.join(fixtures, asset.name))
    const size = gzipSize.sync(fileContents)

    received.push([asset.name, filesize(size).split(' ')[0]])
  })
  // @ts-expect-error test
  const { logs, curVariety } = formatTest(console.log.mock.calls)

  expect(JSON.stringify(received)).toEqual(JSON.stringify(logs))
  expect(curVariety[0] > FIFTY_KILOBYTES).toEqual(true)
})

const state2: Record<string, any> = {
  assetsByChunkName: { main: ['main.abc02671.js'] },
  assets: [
    {
      name: 'main.abc02672.js',
      size: 132365
    },
    {
      name: 'chunk.abc02672.js',
      size: 132365
    }
  ]
}

test('main suggest bundle splitting', () => {
  const sizes = { 'main.css': 1024, 'main.js': 1000 }
  printFileSizesAfterBuild(state2, sizes, fixtures)

  // @ts-expect-error test
  expect(console.log.mock.calls.map((str) => stripAnsi(str[0])).slice(-2)).toEqual([
    'The bundle size is significantly larger than recommended.',
    'You can also analyze the project dependencies: https://webpack.js.org/guides/code-splitting/'
  ])
})

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000))
test('measure file sizes before build error', async () => {
  jest.requireMock('recursive-readdir')
  expect(Object.keys(measureFileSizesBeforeBuild(`${fixtures}/error`)).length).toEqual(0)
  await wait()
  fsExtra.rmdirSync(`${fixtures}/error`)
})
