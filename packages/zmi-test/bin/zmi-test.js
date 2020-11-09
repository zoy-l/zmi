#!/usr/bin/env node
const { yargsParser, chalk, createDebug, assert } = require('@zmi/utils')

const args = yargsParser(process.argv.slice(2), {
  alias: {
    watch: ['w'],
    version: ['v']
  },
  boolean: ['coverage', 'watch', 'version', 'debug', 'e2e'],
  default: {
    e2e: true
  }
})

require('../lib')
  .default(args)
  .catch((err) => {
    assert(err)
  })
