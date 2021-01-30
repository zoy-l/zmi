import path from 'path'
import fs from 'fs'

export default () => {
  const plugins = path.join(__dirname, './plugins')

  const commandsPath = fs.readdirSync(`${plugins}/commands`).map((f) => `commands/${f}`)

  const featuresPath = fs
    .readdirSync(`${plugins}/features`)
    .map((f) => `features/${f}`)
    .filter((file) => file.endsWith('.js'))

  return ['registerMethods', ...commandsPath, ...featuresPath].map((file) =>
    require.resolve(`${plugins}/${file}`)
  )
}
