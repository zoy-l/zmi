import readline from 'readline'

import start from './start'

const isWin = process.platform === 'win32'
const Signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']

if (isWin) {
  start()
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
    process.exit(1)
  })
})
