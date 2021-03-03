import getBabelOptions from './getBabelOptions'

test('getBabelOptions', () => {
  const babel = getBabelOptions({
    // @ts-expect-error test
    config: { extraBabelPresets: [], extraBabelPlugins: [] },
    presetOpts: { sourceMap: false },
    hot: true
  })

  expect(babel).toEqual({
    presets: [[babel.presets[0][0], { sourceMap: false }]],
    plugins: [],
    sourceType: false,
    babelrc: false
  })
})
