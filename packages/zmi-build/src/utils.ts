export function conversion(path: string) {
  const isExtendedPath = /^\\\\\?\\/.test(path)

  if (isExtendedPath) {
    return path
  }

  return path.replace(/\\/g, '/')
}
