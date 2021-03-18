import recursiveReaddir from 'recursive-readdir'
import yargsParser from 'yargs-parser'
import clearModule from 'clear-module'
import babelTypes from '@babel/types'
import portfinder from 'portfinder'
import stripAnsi from 'strip-ansi'
import textTable from 'text-table'
import deepmerge from 'deepmerge'
import gzipSize from 'gzip-size'
import chokidar from 'chokidar'
import filesize from 'filesize'
import mustache from 'mustache'
import inquirer from 'inquirer'
import fsExtra from 'fs-extra'
import makeDir from 'make-dir'
import cheerio from 'cheerio'
import resolve from 'resolve'
import address from 'address'
import lodash from 'lodash'
import pkgUp from 'pkg-up'
import chalk from 'chalk'
import slash from 'slash'
import glob from 'glob'

import launchDevice, { defaultYargsOptions as dyo } from './launchDevice'
import compatibleWithESModule from './compatibleWithESModule'
import parseRequireDeps from './parseRequireDeps'
import { NodeEnv, ArgsType } from './types'
import clearConsole from './clearConsole'
import mergeConfig from './mergeConfig'
import flatDeep from './flatDeep'
import isLerna from './isLerna'
import getFile from './getFile'

const isWin = process.platform === 'win32'

export {
  compatibleWithESModule,
  recursiveReaddir,
  parseRequireDeps,
  launchDevice,
  clearConsole,
  mergeConfig,
  clearModule,
  yargsParser,
  portfinder,
  babelTypes,
  deepmerge,
  stripAnsi,
  textTable,
  mustache,
  chokidar,
  filesize,
  gzipSize,
  flatDeep,
  inquirer,
  ArgsType,
  isLerna,
  getFile,
  address,
  fsExtra,
  makeDir,
  NodeEnv,
  cheerio,
  resolve,
  lodash,
  slash,
  pkgUp,
  isWin,
  chalk,
  glob,
  dyo
}
