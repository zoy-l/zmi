import { chokidar } from '@zmi-cli/utils'
import path from 'path'
import Joi from 'joi'
import fs from 'fs'

import { IChanged } from './types'
import Service from './Service'

const fixtures = path.join(__dirname, '../fixtures')

const wait = () => new Promise((resolve) => setTimeout(resolve, 1500))
jest.setTimeout(30000)

beforeEach(() => {
  process.env = {}
})

test('zmirc', async () => {
  const cwd = path.join(fixtures, 'zmirc')

  const service = new Service({
    cwd
  })
  expect(service.initConifg).toEqual({ foo: 'bar' })
})

test('zmirc-ts', async () => {
  const cwd = path.join(fixtures, 'zmirc-ts')

  const service = new Service({
    cwd
  })
  expect(service.initConifg).toEqual({ foo: 'bar' })
})

test('schema', async () => {
  const cwd = path.join(fixtures, 'schema')
  const service = new Service({
    cwd,
    plugins: [path.join(cwd, 'pluginSchema.js')]
  })
  await expect(service.init()).rejects.toThrow(/"value" must be a number/)
})

test('invalid keys', async () => {
  const cwd = path.join(fixtures, 'invalid-keys')
  const service = new Service({
    cwd
  })
  await expect(service.init()).rejects.toThrow(/Invalid config key: foo/)
})

test('env', async () => {
  const cwd = path.join(fixtures, 'zmi-env')
  process.env.ZMI_ENV = 'los'
  expect(() => {
    new Service({
      cwd
    })
  }).toThrow(/get user config failed/)
})

test('env', () => {
  const cwd = path.join(fixtures, 'zmi-env')
  process.env.ZMI_ENV = 'loc'

  const service = new Service({
    cwd
  })

  expect(service.initConifg).toEqual({ foo: 2 })
})

test('have multiple same bar', async () => {
  const service = new Service({})
  service.stage = 4
  service.plugins.bar = {
    id: '.bar',
    key: 'bar',
    path: './bar',
    apply: () => {},
    config: {
      schema() {
        return Joi.number()
      }
    }
  }

  service.plugins.foo = {
    id: '.foo',
    key: 'bar',
    path: './foo',
    apply: () => {},
    config: {
      schema() {
        return Joi.number()
      }
    }
  }
  await expect(service.init()).rejects.toThrow(/have multiple same bar/)
})

describe('watch', () => {
  const cwd = path.join(fixtures, 'watch-config')

  const service = new Service({
    cwd
  })

  it(cwd, async (done) => {
    service.configInstance.watch({
      userConfig: service.initConifg,
      async onChange(options: {
        pluginChanged: IChanged[]
        valueChanged: IChanged[]
        __watcher: chokidar.FSWatcher
      }) {
        const { pluginChanged, valueChanged, __watcher } = options
        console.log(pluginChanged, valueChanged)
        expect(pluginChanged.length).toEqual(0)
        expect(valueChanged.length).toEqual(1)
        __watcher.close()
        done()
      }
    })
    await wait()
    service.plugins.foo = {
      id: '.foo',
      key: 'foo',
      path: './foo',
      apply: () => {},
      config: {
        schema() {
          return Joi.number()
        }
      }
    }

    fs.writeFileSync(`${cwd}/.zmirc.js`, `export default { foo: 1, plugins:['./foo'] }`)
    require.cache[`${cwd}/.zmirc.js`]!.exports = { foo: 2, plugins: ['./foo'] }

    await wait()
    fs.writeFileSync(`${cwd}/.zmirc.js`, `export default { foo: 1 }`)
    require.cache[`${cwd}/.zmirc.js`]!.exports = { foo: 1 }
  })

  it(cwd, async (done) => {
    service.configInstance.watch({
      userConfig: service.initConifg,
      async onChange(options: {
        pluginChanged: IChanged[]
        valueChanged: IChanged[]
        __watcher: chokidar.FSWatcher
      }) {
        const { pluginChanged, valueChanged, __watcher } = options

        expect(pluginChanged.length).toEqual(1)
        expect(valueChanged.length).toEqual(0)
        __watcher.close()
        done()
      }
    })
    await wait()
    service.plugins.foo = {
      id: '.foo',
      key: 'foo',
      path: './foo',
      apply: () => {},
      config: {
        schema() {
          return Joi.number()
        }
      }
    }

    fs.writeFileSync(`${cwd}/.zmirc.js`, `export default { foo: 1, plugins:['./foo'] }`)
    require.cache[`${cwd}/.zmirc.js`]!.exports = { foo: false, plugins: ['./foo'] }
    process.env.ZMI_ENV = `loc`

    await wait()
    fs.writeFileSync(`${cwd}/.zmirc.js`, `export default { foo: 1 }`)
    require.cache[`${cwd}/.zmirc.js`]!.exports = { foo: 1 }
  })
})
