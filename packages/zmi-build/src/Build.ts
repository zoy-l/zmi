import { Diagnostic } from 'typescript'
import gulpPlumber from 'gulp-plumber'
import * as babel from '@babel/core'
import glupTs from 'gulp-typescript'
import chokidar from 'chokidar'
import through from 'through2'
import vinylFs from 'vinyl-fs'
import { merge } from 'lodash'
import gulpIf from 'gulp-if'
import rimraf from 'rimraf'
import assert from 'assert'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'

import { colorLog, conversion, eventColor, clearConsole } from './utils'
import getBabelConfig from './getBabelConifg'
import type { IBundleOptions } from './types'
import getTSConfig from './getTsConifg'
import config from './config'

interface IBuild {
  cwd: string
  watch: boolean
}

export default class Build {
  cwd: string

  isLerna: boolean

  watch: boolean

  rootConfig = {}

  bundleOpts: IBundleOptions = {}

  tsConifgError: Diagnostic | undefined

  constructor(options: IBuild) {
    this.cwd = options.cwd
    this.watch = options.watch
    this.isLerna = fs.existsSync(path.join(options.cwd, 'lerna.json'))
  }

  logInfo({ pkg, msg }: { pkg?: string; msg: string }) {
    console.log(`${pkg ? `${colorLog(pkg)}: ` : ''}${msg}`)
  }

  getBundleOpts(cwd: string) {
    const userConfig = config(cwd)

    const bundleOpts = merge(this.rootConfig, userConfig)

    return bundleOpts
  }

  transform(opts: { content: string; path: string }) {
    const { content, path } = opts

    const babelConfig = getBabelConfig(this.bundleOpts)

    return babel.transformSync(content, {
      ...babelConfig,
      filename: path,
      configFile: false
    })?.code
  }

  createStream({
    src,
    pkg,
    dir
  }: {
    src: string[] | string
    pkg?: string
    dir: string
  }) {
    const { moduleType, entry, output } = this.bundleOpts
    const { tsConfig, error } = getTSConfig(this.cwd, this.isLerna ? dir : '')

    if (error) {
      this.tsConifgError = error
    }

    return vinylFs
      .src(src, {
        base: path.join(dir, entry!),
        allowEmpty: true
      })
      .pipe(gulpPlumber(() => {}))
      .pipe(
        gulpIf((file) => {
          const fileType = ['.js', '.ts']

          if (
            fileType.includes(path.extname(file.path)) &&
            !file.path.endsWith('.d.ts')
          ) {
            this.logInfo({
              pkg,
              msg: `${chalk.green('➜')} Transform to ${chalk.yellow(
                moduleType
              )} for ${chalk.blue(
                `${entry}${file.path.replace(path.join(dir, entry!), '')}`
              )}`
            })
          }

          return /\.ts$/.test(file.path) && !file.path.endsWith('.d.ts')
        }, glupTs(tsConfig))
      )
      .pipe(
        gulpIf(
          (file) => /\.js?$/.test(file.path) && !file.path.endsWith('.d.ts'),
          through.obj((chunk, _enc, callback) => {
            chunk.contents = Buffer.from(
              this.transform({
                content: chunk.contents,
                path: chunk.path
              }) as string
            )

            chunk.path = chunk.path.replace(path.extname(chunk.path), '.js')

            callback(null, chunk)
          }) as NodeJS.ReadWriteStream
        )
      )
      .pipe(vinylFs.dest(path.join(dir, output!)))
  }

  async compileLerna() {
    let userPkgs = fs.readdirSync(path.join(this.cwd, 'packages'))
    const userConifg = config(this.cwd)

    if (userConifg.pkgs) {
      userPkgs = userConifg.pkgs
    }

    this.rootConfig = userConifg

    userPkgs = userPkgs.reduce((memo, pkg) => {
      const pkgPath = path.join(this.cwd, 'packages', pkg)
      if (fs.statSync(pkgPath).isDirectory()) {
        memo = memo.concat(pkg)
      }
      return memo
    }, [] as string[])

    for (const pkg of userPkgs) {
      const pkgPath = path.join(this.cwd, 'packages', pkg)
      assert(
        fs.existsSync(path.join(pkgPath, 'package.json')),
        `package.json not found in packages/${pkg}`
      )
      process.chdir(pkgPath)

      await this.compile(pkgPath, pkg)
    }
  }

  compile(dir: string, pkg?: string) {
    this.bundleOpts = this.getBundleOpts(dir)

    const { entry, output } = this.bundleOpts as IBundleOptions & {
      entry: string
      output: string
    }

    this.logInfo({ pkg, msg: chalk.gray(`➜ Clean ${output} directory`) })
    rimraf.sync(path.join(dir, output))

    return new Promise<void>((resolve) => {
      const srcPath = path.join(dir, entry)

      const patterns = [
        path.join(srcPath, '**/*'),
        `!${path.join(srcPath, '**/*.mdx')}`,
        `!${path.join(srcPath, '**/*.md')}`,
        `!${path.join(srcPath, '**/demos{,/**}')}`,
        `!${path.join(srcPath, '**/fixtures{,/**}')}`,
        `!${path.join(srcPath, '**/__test__{,/**}')}`,
        `!${path.join(srcPath, '**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)')}`
      ]
      this.createStream({ src: patterns, pkg, dir }).on('end', () => {
        if (this.watch) {
          this.logInfo({
            pkg,
            msg: chalk.blue(
              `➜ Start watching ${
                pkg ?? conversion(srcPath).replace(`${this.cwd}/`, '')
              } directory...`
            )
          })

          if (this.tsConifgError) {
            this.logInfo({
              msg: chalk.red(
                `❗ no such file tsconfig.json will use the default configuration!\n`
              )
            })
          }

          const watcher = chokidar.watch(patterns, {
            ignoreInitial: true,
            awaitWriteFinish: {
              stabilityThreshold: 600
            }
          })

          const files: string[] = []

          watcher.on('all', (event, fullPath) => {
            const relPath = fullPath.replace(srcPath, '')

            this.logInfo({
              msg: `${eventColor(event)} ${conversion(
                path.join(srcPath, relPath)
              ).replace(`${this.cwd}/`, '')}`
            })

            if (!fs.existsSync(fullPath)) {
              const fullLibPath = fullPath.replace(entry, output)
              rimraf.sync(fullLibPath)
              return
            }
            if (fs.statSync(fullPath).isFile()) {
              if (!files.includes(fullPath)) files.push(fullPath)
              while (files.length) {
                this.createStream({ src: files.pop()!, dir })
              }
            }
          })
          process.once('SIGINT', () => {
            watcher.close()
          })
        }

        resolve()
      })
    })
  }

  async step() {
    clearConsole()
    if (this.isLerna) {
      await this.compileLerna()
    } else {
      await this.compile(this.cwd)
    }
  }
}
