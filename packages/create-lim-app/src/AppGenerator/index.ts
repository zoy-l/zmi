import { copyFileSync, readFileSync, statSync, writeFileSync } from 'fs'
import { yargs, glob, chalk, mkdirp, mustache } from '@lim/cli-utils'
import path from 'path'

export interface IOpts {
  cwd: string
  args: yargs.Arguments
}

interface copyTplOpts {
  templatePath: string
  target: string
  context: object
}

interface copyDirectoryOpts {
  path: string
  context: object
  target: string
}

export default class Generator {
  cwd: string
  args: yargs.Arguments

  constructor(opt: IOpts) {
    this.cwd = opt.cwd
    this.args = opt.args
  }

  run() {
    this.writing()
  }

  writing() {
    this.copyDirectory({
      context: {
        version: require('../../package').version
      },
      path: path.join(__dirname, '../../templates'),
      target: this.cwd
    })
  }

  copyTpl(opts: copyTplOpts) {
    const tpl = readFileSync(opts.templatePath, 'utf-8')
    const content = mustache.render(tpl, opts.context)
    mkdirp.sync(path.dirname(opts.target))
    console.log(
      `${chalk.green('Write:')} ${path.relative(this.cwd, opts.target)}`
    )
    writeFileSync(opts.target, content, 'utf-8')
  }

  copyDirectory(opts: copyDirectoryOpts) {
    const files = glob.sync('**/*', {
      cwd: opts.path,
      dot: true,
      ignore: ['**/node_modules/**']
    })

    files.forEach((file) => {
      const absFile = path.join(opts.path, file)
      if (statSync(absFile).isDirectory()) return
      if (file.endsWith('.tpl')) {
        this.copyTpl({
          templatePath: absFile,
          target: path.join(opts.target, file.replace(/\.tpl$/, '')),
          context: opts.context
        })
      } else {
        console.log(`${chalk.green('Copy: ')} ${file}`)
        const absTarget = path.join(opts.target, file)
        mkdirp.sync(path.dirname(absTarget))
        copyFileSync(absFile, absTarget)
      }
    })
  }
}
