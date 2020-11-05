// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import crequire from 'crequire'
import resolve from 'resolve'
import lodash from 'lodash'
import path from 'path'
import fs from 'fs'

import winPath from './winPath'

function parse(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  return (crequire(content) as any[]).filter((item) => {
    return (
      item.path.charAt(0) === '.' &&
      winPath(
        resolve.sync(item.path, {
          basedir: path.dirname(filePath),
          extensions: ['.tsx', '.ts', '.jsx', '.js']
        })
      )
    )
  })
}

export default function parseRequireDeps(filePath: string) {
  const paths = [filePath]
  const ret = [winPath(filePath)]

  while (paths.length) {
    // Avoid relying on circular references
    const extraPaths = lodash.pullAll(parse(paths.shift()!), ret)
    if (extraPaths.length) {
      paths.push(...extraPaths)
      ret.push(...extraPaths)
    }
  }

  return ret
}
