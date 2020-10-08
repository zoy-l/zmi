import { yargsParser } from '@lim/cli-utils'
import create from './'
const args = yargsParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h']
  },
  boolean: ['version']
})

create({ cwd: process.cwd(), args })
