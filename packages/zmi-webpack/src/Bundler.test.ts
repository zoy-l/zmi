import { EntryObject } from 'webpack'
import path from 'path'

import Bundler from './Bundler'
import Html from './Html'

const wait = () => new Promise((resolve) => setTimeout(resolve, 1500))
jest.setTimeout(30000)

process.env.ZMI_TEST = 'true'

afterAll(() => {
  jest.resetAllMocks()
  delete process.env.ZMI_TEST
})

const fixtures = path.join(__dirname, '../fixtures')

const contentArgs = {
  headScripts: [],
  metas: [],
  styles: [],
  scripts: [],
  links: []
}
const port = 8000
const host = '0.0.0.0'

describe('setupDevServer', () => {
  const paths = [
    { cwd: path.join(fixtures, 'vue-config'), entry: './src/index.js' },
    { cwd: path.join(fixtures, 'react-config'), entry: './src/index.jsx' }
  ]

  paths.forEach(({ cwd, entry }) => {
    const config = require(cwd)
    const bundler = new Bundler({ cwd, config, pkg: {} })
    const html = new Html({ config })

    it(cwd, async (done) => {
      const content = await html.getContent(contentArgs)

      const args = {
        entry: {
          main: path.join(cwd, entry)
        },
        htmlContent: content,
        port
      }

      const bundleConfigs = await bundler.getConfig({
        env: 'production',
        ...args
      })

      const { err } = await bundler.build({
        bundleConfigs,
        appOutputPath: path.join(cwd, './dist')
      })
      expect(err).toEqual(null)

      await wait()
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
      devServer.listen(port, host, (error) => {
        expect(error).toEqual(undefined)
      })

      await wait()
      devServer.close()
      done()
    })
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

    expect(/17.0.1/.test(JSON.stringify(bundleConfigs.plugins?.[0]))).toEqual(true)
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
