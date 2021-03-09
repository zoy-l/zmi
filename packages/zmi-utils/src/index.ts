import yargsParser from 'yargs-parser'
import clearModule from 'clear-module'
import babelTypes from '@babel/types'
import portfinder from 'portfinder'
import deepmerge from 'deepmerge'
import chokidar from 'chokidar'
import mustache from 'mustache'
import inquirer from 'inquirer'
import cheerio from 'cheerio'
import resolve from 'resolve'
import mkdirp from 'mkdirp'
import lodash from 'lodash'
import pkgUp from 'pkg-up'
import chalk from 'chalk'
import slash from 'slash'
import glob from 'glob'
import filesize from 'filesize'
import fsExtra from 'fs-extra'
import gzipSize from 'gzip-size'
import recursiveReaddir from 'recursive-readdir'
import stripAnsi from 'strip-ansi'
import textTable from 'text-table'
import address from 'address'

import launchDevice, { defaultYargsOptions as dyo } from './launchDevice'
import compatibleWithESModule from './compatibleWithESModule'
import parseRequireDeps from './parseRequireDeps'
import { NodeEnv, ArgsType } from './types'
import BabelRegister from './BabelRegister'
import clearConsole from './clearConsole'
import mergeConfig from './mergeConfig'
import flatDeep from './flatDeep'
import isLerna from './isLerna'
import getFile from './getFile'

const isWin = process.platform === 'win32'

export {
  address,
  recursiveReaddir,
  stripAnsi,
  textTable,
  fsExtra,
  filesize,
  gzipSize,
  slash,
  babelTypes,
  flatDeep,
  isLerna,
  parseRequireDeps,
  getFile,
  clearModule,
  NodeEnv,
  ArgsType,
  cheerio,
  pkgUp,
  lodash,
  chokidar,
  BabelRegister,
  deepmerge,
  mergeConfig,
  compatibleWithESModule,
  isWin,
  dyo,
  resolve,
  launchDevice,
  clearConsole,
  portfinder,
  yargsParser,
  chalk,
  mustache,
  glob,
  mkdirp,
  inquirer
}
