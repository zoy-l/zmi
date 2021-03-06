import path from 'path'
import { EntryObject } from 'webpack'
import stripAnsi from 'strip-ansi'

import Bundler from './Bundler'
import Html from './Html'

const fixtures = path.join(__dirname, '../fixtures')
const wait = () => new Promise((resolve) => setTimeout(resolve, 1500))
jest.setTimeout(30000)

process.env.ZMI_TEST = 'true'
beforeEach(() => {
  window.console.warn = jest.fn()
  window.console.log = jest.fn()
})

afterAll(() => {
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

    expect(
      // @ts-expect-error test
      console.log.mock.calls
        .map((str: string[]) => stripAnsi(str[0]))
        .includes(' BUILD  Compiled successfully !\n ')
    ).toEqual(true)

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

    expect(
      /Running metro bundler/.test(
        // @ts-expect-error test
        console.log.mock.calls.map((str: string[]) => stripAnsi(str[0])).join('')
      )
    ).toEqual(true)
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

    expect(
      // @ts-expect-error test
      console.log.mock.calls
        .map((str: string[]) => stripAnsi(str[0]))
        .includes(' BUILD  Compiled successfully !\n ')
    ).toEqual(true)

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

    expect(
      /Search for the keywords to learn more about each error./.test(
        // @ts-expect-error test
        console.warn.mock.calls.map((str: string[]) => stripAnsi(str[0])).join('')
      )
    ).toEqual(true)

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

    expect(
      /react.js/.test(
        JSON.parse(JSON.stringify(bundleConfigs.plugins?.[0])).options.baseConfig.extends
      )
    ).toEqual(true)
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
