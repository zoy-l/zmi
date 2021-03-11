import { inquirer, mustache, fsExtra, chalk, yargsParser, glob } from '@zmi-cli/utils'
import path from 'path'
import fs from 'fs'

export interface IOpts {
  cwd: string
  args: yargsParser.Arguments
}

export default async function generator(cwd: string, args: yargsParser.Arguments) {
  const { yellow, cyan, green, blue, magenta } = chalk
  let appName = args._[0]

  const directoryList = fs
    .readdirSync(cwd)
    .filter((file) => fs.lstatSync(path.join(cwd, file)).isDirectory())

  if (!appName) {
    const { IAppName } = await inquirer.prompt({
      type: 'input',
      name: 'IAppName',
      message: yellow.bold('please enter project name:'),
      default: 'zmi-project'
    })
    appName = IAppName
  }

  let IappName = appName

  const isEmptyDir =
    fs.existsSync(path.join(cwd, IappName)) && !!fs.readdirSync(path.join(cwd, IappName)).length

  while (isEmptyDir) {
    const { newAppName } = await inquirer.prompt({
      type: 'input',
      name: 'newAppName',
      message: yellow(
        [
          `The \`${cyan(IappName)}\` `,
          'folder already exists and is not empty.\n',
          'please enter a new project name : '
        ].join('')
      ),
      prefix: '⚠️ '
    })
    IappName = `${newAppName}`

    if (!directoryList.includes(`${newAppName}`)) {
      break
    }
  }

  cwd = path.join(cwd, IappName)

  const { template } = await inquirer.prompt({
    type: 'list',
    name: 'template',
    message: yellow('Choose the template you want'),
    choices: [
      { name: blue('react'), value: 'react' },
      { name: blue('react-ts'), value: 'react-ts' },
      { name: cyan('vue'), value: 'vue' },
      { name: cyan('vue-ts'), value: 'vue-ts' },
      { name: green('miniapp'), value: 'miniapp' }
    ]
  })

  const templatePath = path.join(__dirname, `../templates/${template}`)
  const context = {
    version: require('../package').version
  }

  const files = glob.sync('**/*', {
    ignore: ['**/node_modules/**'],
    cwd: templatePath,
    dot: true
  })

  files.forEach((file) => {
    const absFile = path.join(templatePath, file)
    if (fs.statSync(absFile).isDirectory()) return
    if (file.endsWith('.tpl')) {
      const target = path.join(cwd, file.replace(/\.tpl$/, ''))
      const tpl = fs.readFileSync(absFile, 'utf-8')
      const content = mustache.render(tpl, context)
      fsExtra.mkdirSync(path.dirname(target))
      console.log(`${magenta('[Make]: ')} ${path.relative(cwd, target)}`)
      fsExtra.writeFileSync(target, content, 'utf-8')
    } else {
      console.log(`${magenta('[Make]: ')} ${file}`)
      const absTarget = path.join(cwd, file)
      fsExtra.mkdirSync(path.dirname(absTarget))
      fsExtra.copyFileSync(absFile, absTarget)
    }
  })

  console.log(
    [
      '┌────────────────────────────────────┐',
      '│ Install dependencies: $ yarn       │',
      '│ Start the dev server: $ yarn start │',
      '└────────────────────────────────────┘'
    ].join('\n')
  )
}
