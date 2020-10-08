#! /usr/bin/env node

import yargsParser from 'yargs-parser'

const args = yargsParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h']
  },
  boolean: ['version']
})

console.log(args)
