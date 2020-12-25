import babel from '@babel/core'
import * as yargsParser from 'yargs-parser'
import * as vinylFs from 'vinyl-fs'
import * as fs from 'fs'
import * as path from 'path'
import * as rimraf from 'rimraf'
import * as through from 'through2'
import * as chokidar from 'chokidar'

// import { conversion } from './utils'
console.log(yargsParser);


function getBabelConfig() {
  const targets = { node: 8 }
  return {
    presets: [
      [require.resolve('@babel/preset-typescript'), {}],
      [
        require.resolve('@babel/preset-env'),
        {
          targets
        }
      ]
    ],
    plugins: [
      require.resolve('@babel/plugin-proposal-export-default-from'),
      require.resolve('@babel/plugin-proposal-do-expressions'),
      require.resolve('@babel/plugin-proposal-class-properties')
    ]
  }
}

function transform(opts: { content: any; path: any; root: any }) {
  const { content, path } = opts

  const babelConfig = getBabelConfig()
  // log.transform(
  //   chalk[isBrowser ? 'yellow' : 'blue'](
  //     `${slash(path).replace(`${cwd}/`, '')}`
  //   )
  // )
  return babel.transform(content, {
    ...babelConfig,
    filename: path
  }).code
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

  const createStream = (src: string) =>
    vinylFs.src([src, `!${path.join(srcDir, '**/*.test.ts')}`]).pipe(
      through
        .obj((chunk, enc, callback) => {
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
        .pipe(vinylFs.dest(libDir))
    )
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
const watch = args.w || args.watch
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
