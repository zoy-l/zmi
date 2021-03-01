import path from 'path'
import fs from 'fs'

export default () => {
  const plugins = path.join(__dirname, './plugins')

  const [commandsPath, featuresPath] = ['commands', 'features'].map((type) =>
    fs
      .readdirSync(`${plugins}/${type}`)
      .map((f) => `${type}/${f}`)
      .filter((file) => file.endsWith('.js'))
  )

  return {
    plugins: ['registerMethods', ...commandsPath, ...featuresPath].map((file) =>
      require.resolve(`${plugins}/${file}`)
    )
  }
}
