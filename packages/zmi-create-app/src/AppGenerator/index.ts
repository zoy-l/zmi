import {
  clearConsole,
  inquirer,
  mustache,
  mkdirp,
  chalk,
  yargs,
  glob
} from '../../../zmi-utils/lib'
import path from 'path'
import {
  writeFileSync,
  copyFileSync,
  readFileSync,
  readdirSync,
  existsSync,
  lstatSync,
  statSync
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

  async run() {
    const appName = this.args._[0]

    const directoryList = readdirSync(this.cwd).filter((file) =>
      lstatSync(`${this.cwd}/${file}`).isDirectory()
    )

    if (appName) {
      let IappName = appName

      while (1) {
        if (
          existsSync(IappName) &&
          !!readdirSync(`${this.cwd}/${IappName}`).length
        ) {
          const { newAppName } = await inquirer.prompt({
            type: 'input',
            name: 'newAppName',
            message: chalk.yellow.bold(
              [
                `The ${chalk.cyan.bold(`"📁 ${IappName}"`)}`,
                'folder already exists and is not empty.\n',
                '  please enter a new project name : '
              ].join('')
            ),
            prefix: '⚠️ '
          })

          if (!directoryList.includes(`${newAppName}`)) {
            this.cwd += `/${newAppName}`
            break
          } else {
            IappName = `${newAppName}`
          }
        } else {
          this.cwd += `/${IappName}`
          break
        }
      }
    }

    this.writing()
  }

  writing() {
    clearConsole()
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
      `│ ${chalk.magenta('Copy: ')} ${path.relative(this.cwd, opts.target)}`
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
        console.log(`│ ${chalk.magenta('Copy: ')} ${file}`)
        const absTarget = path.join(opts.target, file)
        mkdirp.sync(path.dirname(absTarget))
        copyFileSync(absFile, absTarget)
      }
    })

    console.log(
      [
        '┌────────────────────────────────────┐',
        '│ Install dependencies: $ yarn       |',
        '│ Start the dev server: $ yarn start |',
        '└────────────────────────────────────┘'
      ].join('\n')
    )
  }
}
