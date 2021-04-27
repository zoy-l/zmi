import recursiveReaddir from 'recursive-readdir'
import yargsParser from 'yargs-parser'
import portfinder from 'portfinder'
import stripAnsi from 'strip-ansi'
import textTable from 'text-table'
import deepmerge from 'deepmerge'
import gzipSize from 'gzip-size'
import filesize from 'filesize'
import mustache from 'mustache'
import inquirer from 'inquirer'
import fsExtra from 'fs-extra'
import makeDir from 'make-dir'
import cheerio from 'cheerio'
import resolve from 'resolve'
import address from 'address'
import pkgUp from 'pkg-up'
import chalk from 'chalk'
import slash from 'slash'
import glob from 'glob'
import isEmpty from 'lodash.isempty'
import mapValues from 'lodash.mapvalues'
import pullAll from 'lodash.pullall'

import launchDevice, { defaultYargsOptions as dyo } from './launchDevice'
import compatibleWithESModule from './compatibleWithESModule'
import parseRequireDeps from './parseRequireDeps'
import clearConsole from './clearConsole'
import mergeConfig from './mergeConfig'
import flatDeep from './flatDeep'
import isLerna from './isLerna'
import getFile from './getFile'

const isWin = process.platform === 'win32'
const lodash = { isEmpty, mapValues, pullAll }

export {
  compatibleWithESModule,
  recursiveReaddir,
  parseRequireDeps,
  launchDevice,
  clearConsole,
  mergeConfig,
  yargsParser,
  portfinder,
  deepmerge,
  stripAnsi,
  textTable,
  mustache,
  filesize,
  gzipSize,
  flatDeep,
  inquirer,
  isLerna,
  getFile,
  address,
  fsExtra,
  makeDir,
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
