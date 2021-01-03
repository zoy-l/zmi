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

import { colorLog, conversion, eventColor, clearConsole } from './utils'

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

  isTsFile(path: string) {
    return /\.ts?$/.test(path) && !path.endsWith('.d.ts')
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
      .pipe(gulpPlumber(() => {}))
      .pipe(
        gulpIf(
          (file) => {
            const fileType = ['.js', '.ts']

            if (
              fileType.includes(path.extname(file.path)) &&
              !file.path.endsWith('.d.ts')
            ) {
              this.logInfo({
                pkg,
                msg: `➜ Transform for ${chalk.blue(
                  file.path.replace(this.srcPath.replace('src', ''), '')
                )}`
              })
            }

            return this.isTsFile(file.path)
          },
          glupTs({
            allowSyntheticDefaultImports: true,
            declaration: true,
            module: 'esnext',
            target: 'esnext',
            moduleResolution: 'node',
            typeRoots: []
          })
        )
      )
      .pipe(
        gulpIf(
          (file) => !file.path.endsWith('.d.ts'),
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

    this.logInfo({ msg: chalk.gray(`Clean lib directory`) })
    rimraf.sync(path.join(dir, 'lib'))

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
          this.logInfo({
            msg: chalk.black.bgBlue(
              ` Start watching ${conversion(this.srcPath).replace(
                `${this.cwd}/`,
                ''
              )} directory... \n`
            )
          })

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
              msg: `${eventColor(event)} ${conversion(
                path.join(this.srcPath, relPath)
              ).replace(`${this.cwd}/`, '')}`
            })

            if (!fs.existsSync(fullPath)) {
              const fullLibPath = fullPath.replace('src', 'lib')
              rimraf.sync(fullLibPath)
              return
            }
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
    clearConsole()
    if (this.isLerna) {
      await this.compileLerna()
    } else {
      await this.compile(this.cwd)
    }
  }
}
