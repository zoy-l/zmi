declare type FileType = 'javascript' | 'css'
interface IGetFileOpts {
  base: string
  type: FileType
  fileNameWithoutExt: string
}
export default function getFile(
  opts: IGetFileOpts
): {
  paths: string
  filename: string
} | null
export {}
