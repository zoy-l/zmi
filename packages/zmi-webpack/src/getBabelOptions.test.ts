import getBabelOptions from './getBabelOptions'

test('getBabelOptions', () => {
  const babel = getBabelOptions({
    // @ts-expect-error test
    config: { extraBabelPresets: [], extraBabelPlugins: [] },
    presetOpts: { sourceMap: false },
    hot: true
  })

  expect(babel).toEqual({
    presets: [['/Users/zaire/zmi/packages/zmi-babel-factory/app.js', { sourceMap: false }]],
    plugins: [],
    sourceType: false,
    babelrc: false
  })
})
