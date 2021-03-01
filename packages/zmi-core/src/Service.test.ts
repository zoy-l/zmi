import { winPath } from '@zmi-cli/utils'
import path from 'path'

import { EnumApplyPlugins } from './types'
import Service from './Service'

const fixtures = path.join(__dirname, '../fixtures')
const simplyPluginIds = ({ cwd, plugins }: { cwd: string; plugins: any }) =>
  Object.keys(plugins).map((id) => `[plugin] ${id.replace(winPath(cwd), '.')}`)

test('normal', async () => {
  const cwd = path.join(fixtures, 'normal')
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(path.join(cwd, 'plugins_1')),
      require.resolve(path.join(cwd, 'plugins_2')),
      require.resolve(path.join(cwd, 'plugin_1')),
      require.resolve(path.join(cwd, 'plugin_2'))
    ]
  })

  expect(service.pkg.name).toEqual('foo')
  expect(service.initialPlugins.map((p) => p.key)).toEqual([
    'plugins_1',
    'plugins_2',
    'plugin1',
    'plugin2',
    '2',
    'bigfish',
    '1'
  ])

  await service.init()
  const plugins = simplyPluginIds({
    plugins: service.plugins,
    cwd
  })

  expect(plugins).toEqual([
    '[plugin] ./plugins_1/index',
    '[plugin] ./plugins_1/plugins_1',
    '[plugin] ./plugins_1/plugins_2',
    '[plugin] ./plugins_1/plugins/index',
    '[plugin] ./plugins_1/plugins/pluginsssss_1',
    '[plugin] ./plugins_2/index',
    '[plugin] ./plugin_1',
    '[plugin] ./plugin_2',
    '[plugin] zmi-plugin-2',
    '[plugin] @hins/zmi-plugin-bigfish',
    '[plugin] zmi-plugin-1'
  ])

  expect(service.hooks.foo.length).toEqual(2)

  const ret = await service.applyPlugins({
    key: 'foo',
    type: EnumApplyPlugins.add
  })
  expect(ret).toEqual(['a', 'a'])
})

test('no package.json', () => {
  const service = new Service({
    cwd: path.join(fixtures, 'no-package-json')
  })
  expect(service.pkg).toEqual({})
})

test('applyPlugin with add', async () => {
  const cwd = path.join(fixtures, 'applyPlugins')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'add'))]
  })
  await service.init()
  const ret = await service.applyPlugins({
    key: 'test',
    type: EnumApplyPlugins.add
  })
  expect(ret).toEqual(['a', 'b', 'c', 'd'])
})

test('applyPlugin with add failed with non-array initialValue', async () => {
  const cwd = path.join(fixtures, 'applyPlugins')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'add'))]
  })
  await service.init()

  await expect(
    service.applyPlugins({
      key: 'test',
      type: EnumApplyPlugins.add,
      initialValue: ''
    })
  ).rejects.toThrow(/opts\.initialValue must be Array if opts\.type is add/)
})

test('applyPlugin with modify', async () => {
  const cwd = path.join(fixtures, 'applyPlugins')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'modify'))]
  })
  await service.init()
  const ret = await service.applyPlugins({
    key: 'test',
    type: EnumApplyPlugins.modify,
    initialValue: []
  })
  expect(ret).toEqual(['a', 'b', 'c', 'd'])
})

test('applyPlugin with event', async () => {
  const cwd = path.join(fixtures, 'applyPlugins')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'event'))]
  })
  await service.init()
  let count = 0
  await service.applyPlugins({
    key: 'test',
    type: EnumApplyPlugins.event,
    args: {
      increase(step: number) {
        count += step
      }
    }
  })
  expect(count).toEqual(3)
})

test('applyPlugin with unsupported type', async () => {
  const cwd = path.join(fixtures, 'applyPlugins')
  const service = new Service({
    cwd
  })
  await service.init()
  await expect(
    service.applyPlugins({
      key: 'test',
      type: 'unsupport-event' as EnumApplyPlugins
    })
  ).rejects.toThrow(/type is not defined or is not matched, got/)
})

test('applyPlugin with stage', async () => {
  const cwd = path.join(fixtures, 'applyPlugins')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'stage'))]
  })
  await service.init()
  const ret = await service.applyPlugins({
    key: 'test',
    type: EnumApplyPlugins.add
  })
  expect(ret).toEqual(['c', 'a', 'd', 'e', 'b'])
})

test('applyPlugin with stage and registerMethod', async () => {
  const cwd = path.join(fixtures, 'applyPlugins')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'stage_registerMethod'))]
  })

  await service.init()
  const ret = await service.applyPlugins({
    key: 'foo',
    type: EnumApplyPlugins.add
  })
  expect(ret).toEqual(['c', 'a', 'd', 'e', 'b'])
})

test('registerPlugin id conflict', async () => {
  const cwd = path.join(fixtures, 'registerPlugin-conflict')
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(path.join(cwd, 'plugin_1')),
      require.resolve(path.join(cwd, 'plugin_2'))
    ]
  })
  await expect(service.init()).rejects.toThrow(/plugin foo is already registered by/)
})

test.skip('skip plugins', async () => {
  const cwd = path.join(fixtures, 'skip-plugins')
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(path.join(cwd, 'plugin_1')),
      require.resolve(path.join(cwd, 'plugin_2')),
      require.resolve(path.join(cwd, 'plugin_3')),
      require.resolve(path.join(cwd, 'plugin_4'))
    ]
  })
  await service.init()

  expect(Object.keys(service.hooksByPluginId)).toEqual(['plugin_4'])
})

test('api.registerPlugins', async () => {
  const cwd = path.join(fixtures, 'api-registerPlugins')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'plugin_1'))]
  })
  await service.init()
  const plugins = simplyPluginIds({
    cwd,
    plugins: service.plugins
  })

  expect(plugins).toEqual([
    '[plugin] ./plugin_1',
    '[plugin] plugin_2',
    '[plugin] ./plugin_3'
  ])
})

test('api.registerCommand', async () => {
  const cwd = path.join(fixtures, 'api-registerCommand')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'plugin'))]
  })

  await expect(
    service.runCommand({
      command: 'build'
    })
  ).rejects.toThrow('run command failed, command "build" does not exists.')

  let ret

  ret = await service.run({
    command: 'build',
    args: {
      projectName: 'bar'
    }
  })
  expect(ret).toEqual(`hello bar `)

  ret = await service.runCommand({
    command: 'build',
    args: {
      _: ['foo', 'bar'],
      projectName: 'bar'
    }
  })
  expect(ret).toEqual(`hello bar foo,bar`)

  ret = await service.runCommand({
    command: 'build',
    args: {
      _: ['build', 'bar'],
      projectName: 'bar'
    }
  })
  expect(ret).toEqual(`hello bar bar`)
})

test('api.registerCommand aliased', async () => {
  const cwd = path.join(fixtures, 'api-registerCommand-aliased')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'plugin'))]
  })
  const ret = await service.run({
    command: 'b',
    args: {
      projectName: 'bar'
    }
  })
  expect(ret).toEqual(`hello bar`)
})

test('api.args', async () => {
  const cwd = path.join(fixtures, 'api-args')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'plugin'))]
  })
  const ret = await service.run({
    command: 'build',
    args: {
      projectName: 'bar'
    }
  })
  expect(ret).toEqual(`hello bar`)
})

test('api.registerMethod fail if exist', async () => {
  const cwd = path.join(fixtures, 'api-registerMethod')
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(path.join(cwd, 'plugin_1')),
      require.resolve(path.join(cwd, 'plugin_1_duplicated'))
    ]
  })
  await expect(service.init()).rejects.toThrow(
    /api\.registerMethod\(\) failed, method foo is already exist/
  )
})

test('api.registerMethod return silently if exist and opts.exitsError is set to false', async () => {
  const cwd = path.join(fixtures, 'api-registerMethod')
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(path.join(cwd, 'plugin_1')),
      require.resolve(path.join(cwd, 'plugin_1_duplicated_existsError_false'))
    ]
  })
  await service.init()
})

test('api.registerMethod should have the right plugin id', async () => {
  const cwd = path.join(fixtures, 'api-registerMethod')
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(path.join(cwd, 'plugin_3')),
      require.resolve(path.join(cwd, 'plugin_3_api_foo'))
    ]
  })
  await service.init()
  expect(Object.keys(service.hooksByPluginId)[0]).toContain('./plugin_3_api_foo')
})

test('plugin register throw error', async () => {
  const cwd = path.join(fixtures, 'plugin-register-throw-error')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'plugin'))]
  })
  await expect(service.init()).rejects.toThrow(/foo/)
})

test('plugin syntax error', async () => {
  const cwd = path.join(fixtures, 'plugin-syntax-error')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'plugin'))]
  })
  await expect(service.init()).rejects.toThrow(/Register plugin .+? failed/)
})

test('async plugin register', async () => {
  const cwd = path.join(fixtures, 'asyncPluginRegister')
  const service = new Service({
    cwd,
    plugins: [require.resolve(path.join(cwd, 'foo'))]
  })
  await service.init()
  const c1 = await service.applyPlugins({
    key: 'count',
    type: service.ApplyPluginsType.add
  })
  expect(c1).toEqual(['foo'])
})

test('enableBy', async () => {
  const cwd = path.join(fixtures, 'enableBy')
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(path.join(cwd, 'appType')),
      require.resolve(path.join(cwd, 'foo')),
      require.resolve(path.join(cwd, 'bar_enableByConfig')),
      require.resolve(path.join(cwd, 'hoo_enableByFunction'))
    ]
  })
  await service.init()

  const c1 = await service.applyPlugins({
    key: 'count',
    type: service.ApplyPluginsType.add
  })
  expect(c1).toEqual(['foo'])

  service.initConifg = {
    bar: {}
  }
  const c2 = await service.applyPlugins({
    key: 'count',
    type: service.ApplyPluginsType.add
  })
  expect(c2).toEqual(['foo', 'bar'])

  service.config = {
    appType: 'console'
  }
  const c3 = await service.applyPlugins({
    key: 'count',
    type: service.ApplyPluginsType.add
  })
  expect(c3).toEqual(['foo', 'bar', 'hoo'])
})

test('hasPlugins and hasPresets', async () => {
  const cwd = path.join(fixtures, 'has')
  const service = new Service({
    cwd,
    plugins: [
      require.resolve(path.join(cwd, 'foo_plugin')),
      require.resolve(path.join(cwd, 'mie_plugin_enableByConfig'))
    ]
  })
  await service.init()

  expect(service.hasPlugins(['foo_id'])).toEqual(true)
  expect(service.hasPlugins(['bar_id'])).toEqual(false)
  expect(service.hasPlugins(['mie_id'])).toEqual(false)

  expect(service.hasPlugins(['plugin_dont_exist'])).toEqual(false)

  service.initConifg.bar = false
  expect(service.hasPlugins(['bar_id'])).toEqual(false)

  service.initConifg.mie = 1
  expect(service.hasPlugins(['mie_id'])).toEqual(true)
})

test('resolvePackage with APP_ROOT specified', () => {
  const appRoot = path.join(fixtures, 'normal', 'approot', 'nextlevel')
  const repoRoot = path.join(fixtures, 'normal')
  const service = new Service({
    cwd: appRoot,
    pkg: require(path.join(repoRoot, 'package.json'))
  })
  expect(service.pkg.name).toEqual('foo')
})
