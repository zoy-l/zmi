import yargsParser from 'yargs-parser'
import gulpPlumber from 'gulp-plumber'
import glupTs from 'gulp-typescript'
import * as babel from '@babel/core'
import chokidar from 'chokidar'
import through from 'through2'
import vinylFs from 'vinyl-fs'
import gulpIf from 'gulp-if'
import rimraf from 'rimraf'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'

import { colorLog } from './utils'

interface IBuild {
  cwd: string
  watch: boolean
}

const CONFIG_FILES = ['.zmirc.build.js', '.zmirc.build.ts']

export default class Build {
  cwd: string

  isLerna: boolean

  dirs?: string[]

  watch: boolean

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
    console.log(`${pkg ? `${colorLog(`${pkg}`)}: ` : ''}${msg}`)
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

  transform(opts: { content: any; path: string; root: string }) {
    const { content, path, root } = opts

    const babelConfig = this.getBabelConfig()

    this.logInfo({
      msg: `Transform to ${'cjs'} for ${chalk.blue(path.replace(root, ''))}`
    })

    return babel.transformSync(content, {
      ...babelConfig,
      filename: path,
      configFile: false
    })?.code
  }

  createStream(dir: string) {
    const srcDir = path.join(dir, 'src')

    return vinylFs
      .src(
        [path.join(srcDir, '**/*'), `!${path.join(srcDir, '**/*.test.ts')}`],
        {
          base: srcDir
        }
      )
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
                  path: chunk.path,
                  root: path.join(this.cwd, dir)
                }) as any
              )
              chunk.path = chunk.path.replace(path.extname(chunk.path), '.js')
            }
            callback(null, chunk)
          })
        )
      )
      .pipe(vinylFs.dest(path.join(dir, 'lib')))
  }

  async compileLerna() {
    let pkgs = fs.readdirSync(path.join(this.cwd, 'packages'))

    pkgs = pkgs.reduce((memo, pkg) => {
      console.log(pkg)
      memo = memo.concat(pkg)
      return memo
    }, [] as string[])

    while (pkgs.length) {
      this.compile(pkgs.shift()!)
    }
  }

  compile(dir: string) {
    rimraf.sync(path.join(this.cwd, path.join(dir, 'lib')))

    const stream = this.createStream(dir)
  }

  step() {
    if (this.isLerna && this.dirs) {
      this.dirs.forEach((pkg) => {
        this.compileLerna(`./packages/${pkg}`)
      })
    } else {
      this.compile('./')
    }
  }
}
