import fs from 'fs'
import path from 'path'

export default function (root: string) {
  return fs.existsSync(path.join(root, 'lerna.json'))
}
