import { getArgs, chalk } from '@lim/cli-utils'

import fork from './utils/fork'

const args = getArgs()

const run = async () => {
  try {
    switch (args._[0]) {
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
        break
    }
  } catch (err) {
    console.error(chalk.red(err.message))
    console.error(err.stack)
    process.exit(1)
  }
}

run()
