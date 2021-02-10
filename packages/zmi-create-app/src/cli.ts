import { yargsParser } from '@zmi/utils'
import generator from './AppGenerator'

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
  generator(process.cwd(), args)
}
