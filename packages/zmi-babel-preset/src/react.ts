import basePreset, { toObject } from '.'

export default function (_context: never, opts: Record<string, any>) {
  return {
    presets: [
      [basePreset, opts],
      ['@babel/preset-react', toObject(opts.frameOptions)]
    ].filter(Boolean),
    plugins: [
      opts.reactRemovePropTypes && [
        'babel-plugin-transform-react-remove-prop-types',
        {
          removeImport: true
        }
      ]
    ].filter(Boolean)
  }
}
