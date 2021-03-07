import { chalk, filesize, fsExtra, gzipSize, stripAnsi, recursiveReaddir } from '@zmi-cli/utils'
import webpack from 'webpack'
import path from 'path'
import fs from 'fs'

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

const recursive = (path: string): Promise<{ error: Error; files: string[] }> =>
  new Promise((resolve) => {
    recursiveReaddir(path, (error, files) => {
      resolve({ error, files })
    })
  })

interface IState {
  size: number
  sizeLabel: string
  name: string
  folder?: string
}

function canReadAsset(asset: string) {
  return (
    /\.(js|css)$/.test(asset) &&
    !/service-worker\.js/.test(asset) &&
    !/precache-manifest\.[0-9a-f]+\.js/.test(asset)
  )
}

function removeFileNameHash(buildFolder: string, fileName: string) {
  return fileName
    .replace(buildFolder, '')
    .replace(/\\/g, '/')
    .replace(/\/?(.*)(\.[0-9a-f]+)(\.chunk)?(\.js|\.css)/, (_match, p1, _p2, _p3, p4) => p1 + p4)
}

// Input: 1024, 2048
// Output: "(+1 KB)"
function getDifferenceLabel(currentSize: number, previousSize: number) {
  const FIFTY_KILOBYTES = 1024 * 50
  const difference = currentSize - previousSize
  const fileSize = !Number.isNaN(difference) ? filesize(difference) : 0
  if (difference >= FIFTY_KILOBYTES) {
    return chalk.red('+' + fileSize)
  }
  if (difference < FIFTY_KILOBYTES && difference > 0) {
    return chalk.yellow('+' + fileSize)
  }
  if (difference < 0) {
    return chalk.green(`${fileSize}`)
  }
  return ''
}

// Prints a detailed summary of build files.
export function printFileSizesAfterBuild(
  webpackStats: webpack.StatsCompilation,
  previousSizeMap: Record<string, number>,
  buildFolder: string
) {
  let assets: IState[] = []

  if (webpackStats.assets) {
    assets = webpackStats.assets
      .filter((asset) => canReadAsset(asset.name))
      .map((asset) => {
        const fileContents = fs.readFileSync(path.join(buildFolder, asset.name))
        const size = gzipSize.sync(fileContents)
        const previousSize = previousSizeMap[removeFileNameHash(buildFolder, asset.name)]
        const difference = getDifferenceLabel(size, previousSize)

        return {
          folder: path.join(path.basename(buildFolder), path.dirname(asset.name)),
          name: path.basename(asset.name),
          size,
          sizeLabel: filesize(size) + (difference ? ` (${difference}) ` : '')
        }
      })
      .sort((a, b) => b.size - a.size)
  }

  const longestSizeLabelLength = Math.max(...assets.map((a) => stripAnsi(a.sizeLabel).length))
  let suggestBundleSplitting = false

  assets.forEach((asset) => {
    let { sizeLabel } = asset
    const sizeLength = stripAnsi(sizeLabel).length
    if (sizeLength < longestSizeLabelLength) {
      const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength)
      sizeLabel += rightPadding
    }

    const isLarge =
      asset.size >
      (asset.name.indexOf('main.') === 0 ? WARN_AFTER_BUNDLE_GZIP_SIZE : WARN_AFTER_CHUNK_GZIP_SIZE)

    if (isLarge && path.extname(asset.name) === '.js') {
      suggestBundleSplitting = true
    }

    const assetPath = chalk.dim(`${asset.folder}${path.sep}`)
    const assetName = chalk.cyan(asset.name)
    const size = isLarge ? chalk.yellow(sizeLabel) : sizeLabel

    console.log(`➜  ${assetPath}${assetName}  ${size}`)
  })

  if (!assets.length) {
    console.log(`➜ file has not changed`)
  }

  if (suggestBundleSplitting) {
    console.log()
    console.log(chalk.yellow('The bundle size is significantly larger than recommended.'))
    console.log(
      chalk.yellow(
        'You can also analyze the project dependencies: https://webpack.js.org/guides/code-splitting/'
      )
    )
  }
}

export async function measureFileSizesBeforeBuild(
  buildFolder: string
): Promise<Record<string, number>> {
  const { error, files } = await recursive(buildFolder)
  const sizes: Record<string, number> = {}

  if (!error && files) {
    for (const fileName of files.filter(canReadAsset)) {
      const contents = fs.readFileSync(fileName)
      const key = removeFileNameHash(buildFolder, fileName)
      sizes[key] = gzipSize.sync(contents)
    }

    return sizes
  }

  if (/ENOENT: no such file or directory/.test(error.message)) {
    fsExtra.mkdirpSync(buildFolder)
    return {}
  }

  throw new Error(error.message)
}
