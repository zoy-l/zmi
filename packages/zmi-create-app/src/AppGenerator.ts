import {
  clearConsole,
  inquirer,
  mustache,
  mkdirp,
  chalk,
  yargsParser,
  glob
} from '@zmi/utils'
import path from 'path'
import fs from 'fs'

export interface IOpts {
  cwd: string
  args: yargsParser.Arguments
}

interface copyTplOpts {
  templatePath: string
  target: string
  context: Record<string, unknown>
}

interface copyDirectoryOpts {
  path: string
  context: Record<string, unknown>
  target: string
}

export default class Generator {
  cwd: string

  args: yargsParser.Arguments

  constructor(opt: IOpts) {
    this.cwd = opt.cwd
    this.args = opt.args
  }

  async run() {
    const appName = this.args._[0]

    const directoryList = fs
      .readdirSync(this.cwd)
      .filter((file) => fs.lstatSync(`${this.cwd}/${file}`).isDirectory())

    if (appName) {
      let IappName = appName as fs.PathLike

      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (
          fs.existsSync(IappName) &&
          !!fs.readdirSync(`${this.cwd}/${IappName}`).length
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
        version: require('../package').version
      },
      path: path.join(__dirname, '../templates'),
      target: this.cwd
    })
  }

  copyTpl(opts: copyTplOpts) {
    const tpl = fs.readFileSync(opts.templatePath, 'utf-8')
    const content = mustache.render(tpl, opts.context)
    mkdirp.sync(path.dirname(opts.target))
    console.log(`│ ${chalk.magenta('[Copy]: ')} ${path.relative(this.cwd, opts.target)}`)
    fs.writeFileSync(opts.target, content, 'utf-8')
  }

  copyDirectory(opts: copyDirectoryOpts) {
    const files = glob.sync('**/*', {
      cwd: opts.path,
      dot: true,
      ignore: ['**/node_modules/**']
    })

    files.forEach((file) => {
      const absFile = path.join(opts.path, file)
      if (fs.statSync(absFile).isDirectory()) return
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
        fs.copyFileSync(absFile, absTarget)
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
