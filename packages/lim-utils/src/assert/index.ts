import chalk from 'chalk'
import clearConsole from '../clearConsole'

export default function assert(value: any, desc: string) {
  if (!value) {
    clearConsole()
    console.error(chalk.red(`✖ ERROR: ${desc}\n`))
    process.exit(1)
  }
}
