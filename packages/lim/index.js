import yargsParser from 'yargs-parser'

yargsParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h']
  },
  boolean: ['version']
})
