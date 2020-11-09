import chalk from 'chalk'
import clearConsole from '../clearConsole'

export default function assert(desc: string | string[], value: any = false) {
  if (!value) {
    clearConsole()
    console.error(
      chalk.red(`✖ ERROR: ${Array.isArray(desc) ? desc.join('') : desc}\n`)
    )
    process.exit(0)
  }
}
