import { glob, chalk, mkdirp, mustache, yargs, inquirer } from '@lim/cli-utils'
import path from 'path'
import {
  copyFileSync,
  readFileSync,
  statSync,
  writeFileSync,
  existsSync,
  readdirSync,
  unlinkSync,
  rmdirSync
} from 'fs'

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
    const appName = this.args._[0]
    if (existsSync(appName)) {
      if (!!readdirSync(`${this.cwd}/${appName}`).length) {
        inquirer
          .prompt({
            type: 'confirm',
            name: 'createAppName',
            message: chalk.yellow.bold(
              'the directory already exists and it is not empty, Whether to cover?'
            ),
            prefix: '⚠️ ',
            default: true
          })
          .then(({ createAppName }) => {
            createAppName
              ? this.delDir(`${this.cwd}/${appName}`)
              : process.exit(0)
          })
      } else {
        this.cwd += appName
      }
    } else {
      this.cwd += appName
      this.createDirectory(this.cwd)
    }
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

  delDir(appPath: string) {
    let files = []
    if (existsSync(appPath)) {
      files = readdirSync(appPath)
      files.forEach((file) => {
        let curPath = path + '/' + file
        if (statSync(curPath).isDirectory()) {
          this.delDir(curPath)
        } else {
          unlinkSync(curPath)
        }
      })
      rmdirSync(appPath)
    }
  }

  createDirectory(appPath: string) {
    mkdirp.sync(appPath)
  }

  copyTpl(opts: copyTplOpts) {
    const tpl = readFileSync(opts.templatePath, 'utf-8')
    const content = mustache.render(tpl, opts.context)
    mkdirp.sync(path.dirname(opts.target))
    console.log(
      `${chalk.magenta('Write:')} ${path.relative(this.cwd, opts.target)}`
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
        console.log(`${chalk.magenta('Copy: ')} ${file}`)
        const absTarget = path.join(opts.target, file)
        mkdirp.sync(path.dirname(absTarget))
        copyFileSync(absFile, absTarget)
      }
    })
  }
}
