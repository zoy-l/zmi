import yargsParser from 'yargs-parser'

const args = yargsParser(process.argv.slice(2))

if (args.v || args.version) {
  console.log(require('./package').version)
  process.exit(0)
}

switch (args._[0]) {
  case 'build':
  case 'rollup':
    require(`./src/${args._}`)
    break
  default:
    throw new Error(`Unknown command ${args._}`)
}
