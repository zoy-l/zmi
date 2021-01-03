import yargsParser from 'yargs-parser'
import gulpPlumber from 'gulp-plumber'
import * as babel from '@babel/core'
import glupTs from 'gulp-typescript'
import chokidar from 'chokidar'
import through from 'through2'
import vinylFs from 'vinyl-fs'
import gulpIf from 'gulp-if'
import rimraf from 'rimraf'
import assert from 'assert'
import lodash from 'lodash'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'

import { colorLog } from './utils'

interface IBuild {
  cwd: string
  watch: boolean
}

export default class Build {
  cwd: string

  isLerna: boolean

  dirs?: string[]

  watch: boolean

  srcPath!: string

  targetPath!: string

  constructor(options: IBuild) {
    this.cwd = options.cwd
    this.isLerna = fs.existsSync(path.join(options.cwd, 'lerna.json'))
    this.watch = options.watch

    if (this.isLerna) {
      this.dirs = fs
        .readdirSync(path.join(this.cwd, 'packages'))
        .filter((dir) => dir.charAt(0) !== '.')
    }
  }

  logInfo({ pkg, msg }: { pkg?: string; msg: string }) {
    console.log(`${pkg ? `${colorLog(pkg)}: ` : ''}${msg}`)
  }

  getBabelConfig() {
    return {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 8
            }
          }
        ]
      ],
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        ['@babel/plugin-proposal-export-default-from', { lazy: true }],
        '@babel/plugin-proposal-do-expressions',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    }
  }

  isTransform(path: string) {
    return /\.js$/.test(path) && !path.endsWith('.d.ts')
  }

  transform(opts: { content: string; path: string }) {
    const { content, path } = opts

    const babelConfig = this.getBabelConfig()

    return babel.transformSync(content, {
      ...babelConfig,
      filename: path,
      configFile: false
    })?.code
  }

  createStream(src: string[] | string, pkg?: string) {
    return vinylFs
      .src(src, {
        base: this.srcPath
      })
      .pipe(gulpPlumber())
      .pipe(
        glupTs({
          allowSyntheticDefaultImports: true,
          declaration: true,
          module: 'esnext',
          target: 'esnext',
          moduleResolution: 'node',
          typeRoots: []
        })
      )
      .pipe(
        gulpIf(
          (file: { path: string }) => this.isTransform(file.path),
          through.obj((chunk, _enc, callback) => {
            const fileType = ['.js', '.ts']

            if (fileType.includes(path.extname(chunk.path))) {
              chunk.contents = Buffer.from(
                this.transform({
                  content: chunk.contents,
                  path: chunk.path
                }) as string
              )

              this.logInfo({
                pkg,
                msg: `Transform for ${chalk.blue(
                  chunk.path.replace(this.srcPath.replace('src', ''), '')
                )}`
              })

              chunk.path = chunk.path.replace(path.extname(chunk.path), '.js')
            }
            callback(null, chunk)
          })
        )
      )
      .pipe(vinylFs.dest(this.targetPath))
  }

  async compileLerna() {
    let pkgs = fs.readdirSync(path.join(this.cwd, 'packages'))

    pkgs = pkgs.reduce((memo, pkg) => {
      const pkgPath = path.join(this.cwd, 'packages', pkg)
      if (fs.statSync(pkgPath).isDirectory()) {
        memo = memo.concat(pkg)
      }
      return memo
    }, [] as string[])

    for (const pkg of pkgs) {
      const pkgPath = path.join(this.cwd, 'packages', pkg)
      assert(
        fs.existsSync(path.join(pkgPath, 'package.json')),
        `package.json not found in packages/${pkg}`
      )
      process.chdir(pkgPath)
      // eslint-disable-next-line no-await-in-loop
      await this.compile(pkgPath, pkg)
    }
  }

  compile(dir: string, pkg?: string) {
    this.srcPath = path.join(dir, 'src')
    this.targetPath = path.join(dir, 'lib')

    rimraf.sync(path.join(this.cwd, path.join(dir, 'lib')))

    // const stream = this.createStream(dir, pkg)

    return new Promise<void>((resolve) => {
      const patterns = [
        path.join(this.srcPath, '**/*'),
        `!${path.join(this.srcPath, '**/*.mdx')}`,
        `!${path.join(this.srcPath, '**/*.md')}`,
        `!${path.join(this.srcPath, '**/demos{,/**}')}`,
        `!${path.join(this.srcPath, '**/fixtures{,/**}')}`,
        `!${path.join(this.srcPath, '**/__test__{,/**}')}`,
        `!${path.join(this.srcPath, '**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)')}`
      ]
      this.createStream(patterns, pkg).on('end', () => {
        if (this.watch) {
          this.logInfo({ msg: '' })

          const watcher = chokidar.watch(patterns, {
            ignoreInitial: true
          })

          const files: string[] = []

          const debouncedCompileFiles = lodash.debounce(() => {
            while (files.length) {
              this.createStream(files.pop()!)
            }
          }, 1000)

          watcher.on('all', (event, fullPath) => {
            const relPath = fullPath.replace(this.srcPath, '')
            this.logInfo({
              msg: `[${event}] ${path
                .join(this.srcPath, relPath)
                .replace(`${this.cwd}/`, '')}`
            })
            if (!fs.existsSync(fullPath)) return
            if (fs.statSync(fullPath).isFile()) {
              if (!files.includes(fullPath)) files.push(fullPath)
              debouncedCompileFiles()
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
    if (this.isLerna && this.dirs) {
      await this.compileLerna()
    } else {
      await this.compile(this.cwd)
    }
  }
}

const args = yargsParser(process.argv.slice(2))
const watch = args.w ?? args.watch
const cwd = process.cwd()

const d = new Build({ cwd, watch })

d.step()
