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

function getBabelConfig() {
  const targets = { node: 8 }
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets
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

function transform(opts: { content: any; path: string; root: any }) {
  const { content, path, root } = opts

  const babelConfig = getBabelConfig()

  console.log(
    colorLog(`Transform to ${'cjs'} for ${chalk.blue(path.replace(root, ''))}`)
  )

  return babel.transformSync(content, {
    ...babelConfig,
    filename: path,
    configFile: false
  })?.code
}

function isLerna(cwd: string) {
  return fs.existsSync(path.join(cwd, 'lerna.json'))
}

function build(dir: string, options: { cwd: string; watch: boolean }) {
  const { cwd, watch } = options
  const libDir = path.join(dir, 'lib')
  const srcDir = path.join(dir, 'src')
  const srcExtra = path.join(srcDir, '**/*')

  rimraf.sync(path.join(cwd, libDir))

  function isTransform(path: string) {
    return /\.js$/.test(path) && !path.endsWith('.d.ts')
  }

  const createStream = (src: string) =>
    vinylFs
      .src([src, `!${path.join(srcDir, '**/*.test.ts')}`], { base: srcDir })
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
          (file: { path: string }) => isTransform(file.path),
          through.obj((chunk, _enc, callback) => {
            const fileType = ['.js', '.ts']

            if (fileType.includes(path.extname(chunk.path))) {
              chunk.contents = Buffer.from(
                transform({
                  content: chunk.contents,
                  path: chunk.path,
                  root: path.join(cwd, dir)
                }) as any
              )
              chunk.path = chunk.path.replace(path.extname(chunk.path), '.js')
            }
            callback(null, chunk)
          })
        )
      )
      .pipe(vinylFs.dest(libDir))
  const stream = createStream(srcExtra)
  stream.on('end', () => {
    if (watch) {
      const watcher = chokidar.watch(path.join(cwd, srcDir), {
        ignoreInitial: true
      })
      watcher.on('all', (event, fullPath) => {
        // const relPath = fullPath.replace(path.join(cwd, srcDir), '')
        // log.watch(`[${event}] ${join(srcDir, relPath)}`)
        if (!fs.existsSync(fullPath)) return
        if (fs.statSync(fullPath).isFile()) {
          createStream(fullPath)
        }
      })
    }
  })
}

const args = yargsParser(process.argv.slice(3))
const watch = args.w ?? args.watch
const cwd = process.cwd()
if (isLerna(cwd)) {
  const dirs = fs
    .readdirSync(path.join(cwd, 'packages'))
    .filter((dir) => dir.charAt(0) !== '.')
  // pkgCount = dirs.length
  dirs.forEach((pkg) => {
    build(`./packages/${pkg}`, {
      cwd,
      watch
    })
  })
} else {
  // pkgCount = 1
  build('./', {
    cwd,
    watch
  })
}
