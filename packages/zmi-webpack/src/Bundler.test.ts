import path from 'path'

import Bundler from './Bundler'
import Html from './Html'

const fixtures = path.join(__dirname, '../fixtures')
const wait = () => new Promise((resolve) => setTimeout(resolve, 1500))
jest.setTimeout(30000)

describe('setupDevServer', () => {
  const cwd = path.join(fixtures, 'vue-config')
  const config = require(cwd)
  const bundler = new Bundler({ cwd, config, pkg: {} })
  const html = new Html({ config })
  const port = 8000
  const host = '0.0.0.0'

  process.env.ZMI_TEST = 'true'

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
    devServer.close()
    await wait()
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
    devServer.close()
    await wait()
    done()
  })
})
