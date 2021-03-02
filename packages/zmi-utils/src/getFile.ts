import path from 'path'
import fs from 'fs'

import winPath from './winPath'

/**
 * @description
 * - `'javascript'`: try to match the file with extname `.{ts(x)|js(x)}`
 * - `'css'`: try to match the file with extname `.{less|sass|scss|stylus|css}`
 */
type FileType = 'javascript' | 'css'

interface IGetFileOpts {
  base: string
  type: FileType
  fileNameWithoutExt: string
}

const extsMap: Record<FileType, string[]> = {
  javascript: ['.ts', '.tsx', '.js', '.jsx'],
  css: ['.less', '.sass', '.scss', '.stylus', '.css']
}

/**
 * Try to match the exact extname of the file in a specific directory.
 * @returns
 * - matched: `{ path: string; filename: string }`
 * - otherwise: `null`
 */
export default function getFile(opts: IGetFileOpts) {
  const exts = extsMap[opts.type]
  const ex = [...exts]
  // why while instead of for-x ?
  // because eslint prompts that you cannot use for-x
  // `eslint no-restricted-syntax`
  // and i don't want to ban it 😑

  while (ex.length) {
    const filename = `${opts.fileNameWithoutExt}${ex.shift()}`
    const paths = winPath(path.join(opts.base, filename))

    if (fs.existsSync(paths)) {
      return {
        path,
        filename
      }
    }
  }
  return null
}
