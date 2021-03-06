import path from 'path'
import { EntryObject } from 'webpack'
import stripAnsi from 'strip-ansi'

import Bundler from './Bundler'
import Html from './Html'

const fixtures = path.join(__dirname, '../fixtures')
const wait = () => new Promise((resolve) => setTimeout(resolve, 1000))
jest.setTimeout(30000)

const _path = process.cwd().split('/')
const isRoot = _path[_path.length - 1] !== 'zmi-webpack'

beforeEach(() => {
  window.console.warn = jest.fn()
  window.console.log = jest.fn()
  process.env.ZMI_TEST = 'true'
})

afterEach(() => {
  jest.resetAllMocks()
  delete process.env.ZMI_TEST
})

describe('setupDevServer', () => {
  const cwd = path.join(fixtures, 'vue-config')
  const config = require(cwd)
  const bundler = new Bundler({ cwd, config, pkg: {} })
  const html = new Html({ config })
  const port = 8000
  const host = '0.0.0.0'

  it(cwd, async (done) => {
    const content = await html.getContent({
      headScripts: [],
      metas: [],
      styles: [],
      scripts: [],
      links: []
    })

    const args = {
      entry: {
        main: path.join(`${cwd}/src`, 'index.js')
      },
      htmlContent: content,
      port
    }

    const bundleConfigs = await bundler.getConfig({
      env: 'production',
      ...args
    })

    await bundler.build({ bundleConfigs, appOutputPath: path.join(cwd, './dist') })
    // @ts-expect-error test
    expect(console.log.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
      'Start packing, please don’t worry, officer...\n',
      ' BUILD  Compiled successfully !\n ',
      '📦 Name: - Size',
      '➜  dist/main.js  23 B',
      undefined
    ])

    const devBundleConfigs = await bundler.getConfig({
      env: 'development',
      ...args
    })
    const devServer = await bundler.setupDevServer({
      bundleConfigs: devBundleConfigs,
      port,
      host
    })

    await wait()

    // @ts-expect-error test
    expect(console.log.mock.calls.map((str) => stripAnsi(str[0])).length).toEqual(10)
    devServer.close()
    done()
  })
})

describe('setupDevServer', () => {
  const cwd = path.join(fixtures, 'react-config')
  const config = require(cwd)
  const bundler = new Bundler({ cwd, config, pkg: {} })
  const port = 8000
  const host = '0.0.0.0'
  const html = new Html({ config })

  it(cwd, async (done) => {
    const content = await html.getContent({
      headScripts: [],
      metas: [],
      styles: [],
      scripts: [],
      links: []
    })

    const args = {
      entry: {
        main: path.join(`${cwd}/src`, 'index.jsx')
      },
      htmlContent: content,
      port: 8000
    }

    const bundleConfigs = await bundler.getConfig({
      env: 'production',
      ...args
    })

    await bundler.build({ bundleConfigs, appOutputPath: path.join(cwd, './dist') })

    // @ts-expect-error test
    expect(console.log.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
      'Start packing, please don’t worry, officer...\n',
      ' BUILD  Compiled successfully !\n ',
      '📦 Name: - Size',
      '➜  dist/main.c9188445.js  59 B (-17 B) ',
      undefined
    ])

    const devBundleConfigs = await bundler.getConfig({
      env: 'development',
      ...args
    })

    const devServer = await bundler.setupDevServer({
      bundleConfigs: devBundleConfigs,
      port,
      host
    })

    await wait()
    // @ts-expect-error test
    expect(console.warn.mock.calls.map((str) => stripAnsi(str[0]))).toEqual([
      `${isRoot ? 'packages/zmi-webpack/' : ''}fixtures/react-config/src/index.jsx\n` +
        '  Line 5:1:  Do not use "@ts-ignore" because it alters compilation errors  @typescript-eslint/ban-ts-comment\n' +
        `${isRoot ? 'packages/zmi-webpack/' : ''}fixtures/react-config/src/index.jsx\n` +
        "  Line 3:7:  'foo' is assigned a value but never used  @typescript-eslint/no-unused-vars\n" +
        '\n' +
        'Search for the keywords to learn more about each error.'
    ])

    devServer.close()
    done()
  })
})

describe('normal', () => {
  const html = new Html()

  let content: string

  beforeEach(async () => {
    content = await html.getContent({
      headScripts: [],
      metas: [],
      styles: [],
      scripts: [],
      links: []
    })
  })

  const args = (cwd: string) => ({
    entry: {
      main: path.join(`${cwd}/src`, 'index.js')
    },
    htmlContent: content,
    port: 8000
  })

  test('framType', async () => {
    const cwd = path.join(fixtures, 'frameType')

    const bundler = new Bundler({ cwd, pkg: require(`${cwd}/package.json`) })
    const bundleConfigs = await bundler.getConfig({
      env: 'production',
      ...args(cwd)
    })

    expect(/eslint-config-zmi\/react\.js/.test(JSON.stringify(bundleConfigs.plugins))).toEqual(true)
  })

  test('user modify config', async () => {
    const cwd = path.join(fixtures, 'user-modify-config')

    const bundler = new Bundler({ cwd, config: require(`${cwd}/index.js`).default })
    const bundleConfigs = await bundler.getConfig({
      env: 'development',
      ...args(cwd)
    })

    const entry = bundleConfigs.entry as EntryObject

    expect(bundleConfigs.cache).toEqual({
      type: 'filesystem',
      buildDependencies: {
        config: [path.join(__dirname, 'getConfig.ts')]
      }
    })
    expect(entry.test).toEqual(['./foo.js'])
    expect(entry.bar).toEqual(['./bar.js'])
    expect(entry.arr).toEqual(['./bar.js', './foo.js'])
  })

  test('alias', async () => {
    const cwd = path.join(fixtures, 'alias')

    const bundler = new Bundler({ cwd, config: require(`${cwd}/index.js`).default })
    const bundleConfigs = await bundler.getConfig({
      env: 'development',
      ...args(cwd)
    })

    const alias = bundleConfigs.resolve?.alias

    expect(alias).toEqual({ src: '@', react: 'vue' })
  })

  test('plugin modify config', async () => {
    const cwd = path.join(fixtures, 'plugin-modify-config')

    const bundler = new Bundler({
      cwd,
      config: require(`${cwd}/index.js`).default
    })
    const bundleConfigs = await bundler.getConfig({
      env: 'development',
      ...args(cwd),
      chainWebpack(webpackConfig) {
        webpackConfig.resolve.alias.set('src', '@@')
      }
    })

    const { resolve, cache } = bundleConfigs

    expect(cache).toEqual({ type: 'memory' })
    expect(resolve?.alias).toEqual({ src: '@@' })
  })
})
