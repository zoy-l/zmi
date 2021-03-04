import path from 'path'

import isLerna from './isLerna'

test('isLerna', () => {
  const is = isLerna(path.join(__dirname, '../'))
  const root = isLerna(path.join(__dirname, '../../../'))

  expect(typeof is).toEqual('boolean')
  expect(is).toEqual(false)
  expect(root).toEqual(true)
})
