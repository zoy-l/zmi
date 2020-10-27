import yargsParser from 'yargs-parser'
import portfinder from 'portfinder'
import mustache from 'mustache'
import inquirer from 'inquirer'
import resolve from 'resolve'
import mkdirp from 'mkdirp'
import chalk from 'chalk'
import yargs from 'yargs'
import glob from 'glob'

import launchDevice, { defaultYargsOptions as dyo } from './launchDevice'
import compatibleWithESModule from './compatibleWithESModule'
import clearConsole from './clearConsole'
import prepareUrls from './prepareUrls'
import paths from './paths'

const isWin = process.platform === 'win32'

export {
  compatibleWithESModule,
  isWin,
  dyo,
  resolve,
  launchDevice,
  clearConsole,
  prepareUrls,
  paths,
  portfinder,
  yargsParser,
  chalk,
  yargs,
  mustache,
  glob,
  mkdirp,
  inquirer
}
