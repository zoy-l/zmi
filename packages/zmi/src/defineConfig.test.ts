import { IConfig } from '.'
import { defineConfig } from './defineConfig'

test('defineConfig', () => {
  const config = { cache: 'memory', devServer: {}, loaderOptions: {} } as IConfig
  expect(defineConfig(config)).toEqual(config)
})
