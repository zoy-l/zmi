import flatDeep from './flatDeep'

test('flatDeep', () => {
  const foo = () => {}
  expect(flatDeep([1, [2, [2, 2]]])).toEqual([1, 2, 2, 2])
  expect(flatDeep([1, ['foo', [{ a: 1 }, { a: 1 }]]])).toEqual([
    1,
    'foo',
    { a: 1 },
    { a: 1 }
  ])
  expect(flatDeep([1, [foo, [{ a: 1 }, { a: 1 }]]])).toEqual([1, foo, { a: 1 }, { a: 1 }])
})
