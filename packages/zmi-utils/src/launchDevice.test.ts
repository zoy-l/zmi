import launchDevice, { defaultYargsOptions } from './launchDevice'

test('launch device', () => {
  const options = launchDevice(defaultYargsOptions)

  expect(options).toEqual({ args: { _: [] }, command: undefined })
})
