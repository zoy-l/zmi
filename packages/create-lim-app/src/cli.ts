import { yargsParser } from '@lim/cli-utils'
import run from './'

const args = yargsParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h']
  },
  boolean: ['version']
})

if (args.version && !args._[0]) {
  const { name, version } = require('../package')
  console.log(`${name}@${version}`)
} else {
  run({ cwd: process.cwd(), args })
}
