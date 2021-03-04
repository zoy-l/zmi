// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import crequire from 'crequire'
import resolve from 'resolve'
import lodash from 'lodash'
import slash from 'slash'
import path from 'path'
import fs from 'fs'

function parse(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  return (crequire(content) as any[])
    .map((o) => o.path)
    .filter((path) => path.charAt(0) === '.')
    .map((paths) =>
      slash(
        resolve.sync(paths, {
          basedir: path.dirname(filePath),
          extensions: ['.tsx', '.ts', '.jsx', '.js']
        })
      )
    )
}

export default function parseRequireDeps(filePath: string) {
  const paths = [filePath]
  const ret = [slash(filePath)]

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
