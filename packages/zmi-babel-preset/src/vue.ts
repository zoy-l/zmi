import basePreset from '.'

export default function (_context: never, opts: Record<string, any>) {
  return {
    presets: [[basePreset, opts]],
    plugins: [require.resolve('@vue/babel-plugin-jsx')]
  }
}
