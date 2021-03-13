import { fork } from 'child_process'
import readline from 'readline'

const child = fork(require.resolve('./start'))
const isWin = process.platform === 'win32'
const Signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']

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
