import { launchDevice, chalk, dyo, isWin, textTable } from '@zmi-cli/utils'
import { Service } from '@zmi-cli/core'
import readline from 'readline'

import { getCwd, getPkg } from './getRoot'

const Signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']
const { args, command } = launchDevice(dyo)
const service = new Service({
  cwd: getCwd(),
  pkg: getPkg(process.cwd()),
  plugins: [require.resolve('@zmi-cli/preset')]
})

try {
  switch (command) {
    case 'dev':
    case 'build':
    case 'webpack':
      service.start({
        command,
        args
      })

      if (isWin) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        })

        rl.on(Signals[0], () => {
          process.emit(Signals[0], Signals[0])
        })
      }

      Signals.forEach((SignalKey) => {
        process.on(SignalKey, () => {
          process.exit(0)
        })
      })
      break
    default:
      console.log('💡 Supported commands:')
      console.log(
        textTable([
          ['   dev', 'Dev Run webpack dev server'],
          ['   build', 'Compile bundler in production mode'],
          ['   webpack', 'View current webpack configuration']
        ])
      )
      break
  }
} catch (err) {
  console.log(chalk.red(err.message))
  console.log(err.stack)
  process.exit(1)
}
