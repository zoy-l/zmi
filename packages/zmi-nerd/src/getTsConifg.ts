import { merge } from 'lodash'
import ts from 'typescript'
import path from 'path'
import fs from 'fs'

export default function getTSConfig(cwd: string, pkgPath: string | undefined) {
  const fileName = 'tsconfig.json'
  const tsconfig =
    [path.join(pkgPath ?? '', fileName), path.join(cwd, fileName)].find((p) =>
      fs.existsSync(p)
    ) ?? fileName

  const readFile = (path: string) => fs.readFileSync(path, 'utf-8')
  const { error, config = {} } = ts.readConfigFile(tsconfig, readFile)

  if (config.extends) {
    const { error: exError, config: exConifg = {} } = ts.readConfigFile(
      path.join(cwd, config.extends),
      readFile
    )

    if (!exError) {
      config.compilerOptions = merge(
        exConifg.compilerOptions ?? {},
        config.compilerOptions ?? {}
      )
    }
  }

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
