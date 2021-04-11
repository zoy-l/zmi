/// <reference types="lodash" />
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
import launchDevice, { defaultYargsOptions as dyo } from './launchDevice'
import compatibleWithESModule from './compatibleWithESModule'
import parseRequireDeps from './parseRequireDeps'
import clearConsole from './clearConsole'
import mergeConfig from './mergeConfig'
import flatDeep from './flatDeep'
import isLerna from './isLerna'
import getFile from './getFile'
declare const isWin: boolean
declare const lodash: {
  isEmpty: (value?: any) => boolean
  mapValues: {
    <TResult>(
      obj: string | null | undefined,
      callback: import('lodash').StringIterator<TResult>
    ): import('lodash').NumericDictionary<TResult>
    <T extends object, TResult_1>(
      obj: T | null | undefined,
      callback: import('lodash').ObjectIterator<T, TResult_1>
    ): { [P in keyof T]: TResult_1 }
    <T_1>(
      obj:
        | import('lodash').Dictionary<T_1>
        | import('lodash').NumericDictionary<T_1>
        | null
        | undefined,
      iteratee: object
    ): import('lodash').Dictionary<boolean>
    <T_2 extends object>(obj: T_2 | null | undefined, iteratee: object): {
      [P_1 in keyof T_2]: boolean
    }
    <T_3, TKey extends keyof T_3>(
      obj:
        | import('lodash').Dictionary<T_3>
        | import('lodash').NumericDictionary<T_3>
        | null
        | undefined,
      iteratee: TKey
    ): import('lodash').Dictionary<T_3[TKey]>
    <T_4>(
      obj:
        | import('lodash').Dictionary<T_4>
        | import('lodash').NumericDictionary<T_4>
        | null
        | undefined,
      iteratee: string
    ): import('lodash').Dictionary<any>
    <T_5 extends object>(obj: T_5 | null | undefined, iteratee: string): {
      [P_2 in keyof T_5]: any
    }
    (obj: string | null | undefined): import('lodash').NumericDictionary<string>
    <T_6>(
      obj:
        | import('lodash').Dictionary<T_6>
        | import('lodash').NumericDictionary<T_6>
        | null
        | undefined
    ): import('lodash').Dictionary<T_6>
    <T_7 extends object>(obj: T_7): T_7
    <T_8 extends object>(obj: T_8 | null | undefined): Partial<T_8>
  }
  pullAll: {
    <T_9>(array: T_9[], values?: import('lodash').List<T_9> | undefined): T_9[]
    <T_10>(
      array: import('lodash').List<T_10>,
      values?: import('lodash').List<T_10> | undefined
    ): import('lodash').List<T_10>
  }
}
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
