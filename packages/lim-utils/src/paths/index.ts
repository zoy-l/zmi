import path from 'path'
import fs from 'fs'

const appDirectory = fs.realpathSync(process.cwd())

export default (relativePath: string) =>
  path.resolve(appDirectory, relativePath)
