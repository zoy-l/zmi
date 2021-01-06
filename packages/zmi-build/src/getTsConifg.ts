import ts from 'typescript'
import path from 'path'
import fs from 'fs'

export default function getTSConfig(cwd: string, pkgPath: string | undefined) {
  const tsconfig =
    [
      path.join(pkgPath ?? '', 'tsconfig.json'),
      path.join(cwd, 'tsconfig.json')
    ].find((p) => fs.existsSync(p)) ?? ''

  const readFile = (path: string) => fs.readFileSync(path, 'utf-8')
  const { error, config = {} } = ts.readConfigFile(tsconfig, readFile)

  return {
    tsConfig: config.compilerOptions ?? {
      allowSyntheticDefaultImports: true,
      declaration: true,
      skipLibCheck: true,
      module: 'esnext',
      target: 'esnext',
      moduleResolution: 'node'
    },
    error
  }
}
