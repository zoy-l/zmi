import yargsParser from 'yargs-parser'
import Build from './build'

const args = yargsParser(process.argv.slice(2))

switch (args._[0]) {
  case 'build':
  case 'rollup':
    require(`./src/${args._}`)
    break
  default:
    throw new Error(`Unknown command ${args._}`)
}
