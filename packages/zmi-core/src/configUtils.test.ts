import { mergeDefault, getPlugin, isEqual } from './configUtils'

test('mergeDefault', () => {
  expect(
    mergeDefault({
      config: { hello: 1 },
      defaultConfig: { kda: 2 }
    })
  ).toEqual({
    hello: 1,
    kda: 2
  })

  expect(
    mergeDefault({
      config: { hello: 1 },
      defaultConfig: { hello: 2 }
    })
  ).toEqual({
    hello: 1
  })

  expect(
    mergeDefault({
      config: undefined,
      defaultConfig: { hello: 2 }
    })
  ).toEqual({
    hello: 2
  })

  expect(
    mergeDefault({
      config: `() => ({ hello: 1 })`,
      defaultConfig: { hello: 2 }
    }).toString()
  ).toEqual(`() => ({ hello: 1 })`)
})

test('getPlugin', () => {
  expect(getPlugin('zmi-plugin-foo')).toEqual(true)
  expect(getPlugin('plugin-foo')).toEqual(false)
  expect(getPlugin('@hins/zmi-plugin-foo')).toEqual(true)
  expect(getPlugin('@hins/plugin-foo')).toEqual(false)
})

test('isEqual', () => {
  expect(
    isEqual(
      () => 2,
      () => 1
    )
  ).toEqual(false)

  expect(
    isEqual(
      () => 2,
      () => 2
    )
  ).toEqual(true)

  expect(
    isEqual(
      {
        foo: 1
      },
      {
        foo: 2
      }
    )
  ).toEqual(false)

  expect(
    isEqual(
      {
        foo: 1
      },
      {
        foo: 1
      }
    )
  ).toEqual(true)

  expect(
    isEqual(
      {
        foo: 1,
        bar: () => 1
      },
      {
        foo: 1,
        bar: () => 2
      }
    )
  ).toEqual(false)

  expect(
    isEqual(
      {
        foo: 1,
        bar: () => 1
      },
      {
        foo: 1,
        bar: () => 1
      }
    )
  ).toEqual(true)

  expect(isEqual(['a'], ['a'])).toEqual(true)
})
