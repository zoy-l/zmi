import getTargets from './getTargets'

const configTargets = {
  ie: 10,
  node: 6,
  chrome: 0,
  firefox: true
}

test('getTargets', () => {
  // @ts-expect-error test
  const { targets, browserslist } = getTargets({ targets: configTargets })
  expect(targets).toEqual({
    chrome: 0,
    firefox: true,
    ie: 10
  })

  expect(browserslist).toEqual(['ie >= 10', 'chrome >= 0', 'firefox >= 0'])
})

test('getTargets null', () => {
  // @ts-expect-error test
  const { targets, browserslist } = getTargets({ targets: {} })
  expect(targets).toEqual({})
  expect(browserslist).toEqual([])
})

test('getTargets false', () => {
  // @ts-expect-error test
  const { targets } = getTargets({
    targets: {
      foo: 1,
      bar: false
    }
  })
  expect(targets).toEqual({ foo: 1 })
})
