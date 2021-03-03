import { ESLint, Linter } from 'eslint'
import stripAnsi from 'strip-ansi'
import table from 'text-table'
import chalk from 'chalk'
import path from 'path'

const cwd = process.cwd()
const emitErrorsAsWarnings = process.env.NODE_ENV === 'development'

function isError(message: Linter.LintMessage) {
  return message.fatal || message.severity === 2
}

export default function formatter(results: ESLint.LintResult[]) {
  let output = '\n'
  let hasErrors = false
  let reportContainsErrorRuleIDs = false

  results.forEach((result) => {
    const { messages } = result
    if (messages.length === 0) {
      return
    }

    let msg = messages.map((message) => {
      let messageType
      if (isError(message) && !emitErrorsAsWarnings) {
        messageType = 'error'
        hasErrors = true
        if (message.ruleId) {
          reportContainsErrorRuleIDs = true
        }
      } else {
        messageType = 'warn'
      }

      let line = `${message.line ?? 0}`
      if (message.column) {
        line = `${line}:${message.column}`
      }
      const position = chalk.bold(`Line ${line}:`)
      return [
        '',
        position,
        messageType,
        message.message.replace(/\.$/, ''),
        chalk.underline(message.ruleId || '')
      ]
    })

    if (hasErrors) {
      msg = msg.filter((m) => m[2] === 'error')
    }

    msg.forEach((m) => {
      m[4] = m[2] === 'error' ? chalk.red(m[4]) : chalk.yellow(m[4])
      m.splice(2, 1)
    })

    const outputTable = table(msg, {
      align: ['l', 'l', 'l'],
      stringLength(str: string) {
        return stripAnsi(str).length
      }
    })
    output += chalk.underline.yellow(`${path.relative(cwd, result.filePath)}\n`)
    output += `${outputTable}\n\n`
  })

  if (reportContainsErrorRuleIDs) {
    output =
      stripAnsi(output) +
      `Search for the ${chalk.underline(chalk.red('keywords'))} to learn more about each error.`
  }

  return output
}
