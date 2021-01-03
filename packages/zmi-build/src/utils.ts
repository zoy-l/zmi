import chalk from 'chalk'

export function conversion(path: string) {
  const isExtendedPath = /^\\\\\?\\/.test(path)

  if (isExtendedPath) {
    return path
  }

  return path.replace(/\\/g, '/')
}

const colors = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'gray',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright'
]

let index = 0
const cache = {}

export function colorLog(pkg: string) {
  if (!cache[pkg]) {
    const color = colors[index]
    const str = chalk[color].bold(pkg)
    cache[pkg] = str
    if (index === colors.length - 1) {
      index = 0
    } else {
      index += 1
    }
  }
  return cache[pkg]
}
