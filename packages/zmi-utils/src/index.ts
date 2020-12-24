import yargsParser from 'yargs-parser'
import clearModule from 'clear-module'
import babelTypes from '@babel/types'
import portfinder from 'portfinder'
import deepmerge from 'deepmerge'
import mustache from 'mustache'
import inquirer from 'inquirer'
import cheerio from 'cheerio'
import resolve from 'resolve'
import mkdirp from 'mkdirp'
import lodash from 'lodash'
import pkgUp from 'pkg-up'
import chalk from 'chalk'
import yargs from 'yargs'
import glob from 'glob'

import launchDevice, { defaultYargsOptions as dyo } from './launchDevice'
import compatibleWithESModule from './compatibleWithESModule'
import parseRequireDeps from './parseRequireDeps'
import { NodeEnv, ArgsType } from './types'
import BabelRegister from './BabelRegister'
import clearConsole from './clearConsole'
import prepareUrls from './prepareUrls'
import mergeConfig from './mergeConfig'
import isLerna from './isLerna'
import getFile from './getFile'
import winPath from './winPath'
import assert from './assert'
import paths from './paths'

const isWin = process.platform === 'win32'

export {
  babelTypes,
  isLerna,
  parseRequireDeps,
  getFile,
  clearModule,
  NodeEnv,
  ArgsType,
  cheerio,
  winPath,
  pkgUp,
  lodash,
  BabelRegister,
  deepmerge,
  mergeConfig,
  compatibleWithESModule,
  isWin,
  assert,
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
