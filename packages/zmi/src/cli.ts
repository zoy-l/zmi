import { launchDevice, chalk, dyo, isWin } from '@zmi-cli/utils'
import { Service } from '@zmi-cli/core'
import readline from 'readline'

import { getCwd, getPkg } from './getRoot'
import fork from './fork'

launchDevice(dyo).then(({ args, command }) => {
  const Signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']

  try {
    switch (command) {
      case 'dev':
        const child = fork(require.resolve('./forkedDev'))

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
            child.kill(SignalKey)
            process.exit(1)
          })
        })
        break
      default:
        if (command === undefined) {
          return
        }
        if (command === 'build') {
          process.env.NODE_ENV = 'production'
        }

        new Service({
          cwd: getCwd(),
          pkg: getPkg(process.cwd()),
          plugins: [require.resolve('@zmi-cli/preset')]
        }).run({
          command,
          args
        })
        break
    }
  } catch (err) {
    console.log(chalk.red(err.message))
    console.log(err.stack)
    process.exit(1)
  }
})
