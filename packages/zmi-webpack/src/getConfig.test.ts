// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { getFrameType } from './getConfig'

test('getFrameType-vue', () => {
  const type = getFrameType({}, { dependencies: { vue: '1' } })

  expect(type).toEqual({ isVue: true, isReact: false })
})

test('getFrameType-react', () => {
  const type = getFrameType({}, { dependencies: { react: '1' } })

  expect(type).toEqual({ isVue: false, isReact: true })
})

test('getFrameType-error', () => {
  try {
    getFrameType({}, { dependencies: { react: '1', vue: '1' } })
  } catch (err) {
    expect(err.message).toEqual(
      'When react/vue is found in dependencies, please specify type in .zmirc:`vue` | `react`'
    )
  }
})

test('getFrameType-null-error', () => {
  try {
    getFrameType({}, {})
  } catch (err) {
    expect(err.message).toEqual(
      'React/vue is not found in dependencies, did you forget to install dependencies ?'
    )
  }
})
