import { yargsParser } from '../../lim-utils/lib'
import run from '.'

const args = yargsParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h']
  },
  boolean: ['version']
})

const pkg = require('../package')

if (args.version && !args._[0]) {
  const { name, version } = pkg
  console.log(`${name}@${version}`)
} else {
  run({ cwd: process.cwd(), args })
}
