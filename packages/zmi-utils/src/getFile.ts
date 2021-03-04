import slash from 'slash'
import path from 'path'
import fs from 'fs'

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

export default function getFile(opts: IGetFileOpts) {
  const exts = extsMap[opts.type]
  const ex = [...exts]
  // why while instead of for-x ?
  // because eslint prompts that you cannot use for-x
  // `eslint no-restricted-syntax`
  // and i don't want to ban it 😑

  while (ex.length) {
    const filename = `${opts.fileNameWithoutExt}${ex.shift()}`
    const paths = slash(path.join(opts.base, filename))

    if (fs.existsSync(paths)) {
      return {
        paths,
        filename
      }
    }
  }
  return null
}
