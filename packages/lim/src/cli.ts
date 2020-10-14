import { getArgs, chalk, dyo, clearConsole } from '@lim/cli-utils'
import fork from './utils/fork'

getArgs(dyo).then(({ command }) => {
  try {
    switch (command) {
      case 'dev':
        const child = fork({
          scriptPath: require.resolve('./forkedDev')
        })
        process.on('SIGINT', () => {
          child.kill('SIGINT')
          process.exit(1)
        })
        process.on('SIGTERM', () => {
          child.kill('SIGTERM')
          process.exit(1)
        })
        break
      default:
        clearConsole()

        if (command === 'build') {
          process.env.NODE_ENV = 'production'
        }
        break
    }
  } catch (err) {
    console.error(chalk.red(err.message))
    console.error(err.stack)
    process.exit(1)
  }
})
