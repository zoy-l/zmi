import basePreset, { toObject } from '.'

export default function (_context: never, opts: Record<string, any>) {
  return {
    presets: [
      [basePreset, opts],
      [require.resolve('@babel/preset-react'), toObject(opts.frameOptions)]
    ].filter(Boolean),
    plugins: [
      opts.reactRemovePropTypes && [
        require.resolve('babel-plugin-transform-react-remove-prop-types'),
        {
          removeImport: true
        }
      ]
    ].filter(Boolean)
  }
}
