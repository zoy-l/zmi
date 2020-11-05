import chalk from 'chalk'
import clearConsole from '../clearConsole'

export default function assert(desc: string, value: any = false) {
  if (!value) {
    clearConsole()
    console.error(chalk.red(`✖ ERROR: ${desc}\n`))
    process.exit(1)
  }
}
