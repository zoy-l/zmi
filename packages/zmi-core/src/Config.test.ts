import path from 'path'
import fs from 'fs'

import { IChanged } from './types'
import Service from './Service'

const fixtures = path.join(__dirname, '../fixtures')

const wait = () => new Promise((resolve) => setTimeout(resolve, 1500))
jest.setTimeout(30000)

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

describe('watch', () => {
  const cwd = path.join(fixtures, 'watch-config')

  const service = new Service({
    cwd
  })
  it(cwd, async (done) => {
    service.configInstance.watch({
      userConfig: service.initConifg,
      async onChange(options: { pluginChanged: IChanged[]; valueChanged: IChanged[] }) {
        const { pluginChanged, valueChanged } = options

        expect(pluginChanged.length).toEqual(1)
        expect(valueChanged.length).toEqual(1)
        done()
      }
    })
    await wait()
    service.plugins.foo = {
      id: '.foo',
      key: 'foo',
      path: './foo',
      apply: () => {}
    }
    fs.writeFileSync(
      `${cwd}/.zmirc.js`,
      `export default { foo: 1,bar: 2, plugins:['./foo'] }`
    )

    // await wait()
    // fs.writeFileSync(`${cwd}/.zmirc.js`, `export default { foo: 1 }`)
  })
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
