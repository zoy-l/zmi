import recursive from 'recursive-readdir'
import { chalk } from '@zmi-cli/utils'
import stripAnsi from 'strip-ansi'
import gzipSize from 'gzip-size'
import filesize from 'filesize'
import webpack from 'webpack'
import path from 'path'
import fs from 'fs'

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

function canReadAsset(asset: string) {
  return (
    /\.(js|css)$/.test(asset) &&
    !/service-worker\.js/.test(asset) &&
    !/precache-manifest\.[0-9a-f]+\.js/.test(asset)
  )
}

function removeFileNameHash(buildFolder: any, fileName: string) {
  return fileName
    .replace(buildFolder, '')
    .replace(/\\/g, '/')
    .replace(
      /\/?(.*)(\.[0-9a-f]+)(\.chunk)?(\.js|\.css)/,
      (_match, p1, _p2, _p3, p4) => p1 + p4
    )
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
  webpackStats: any,
  previousSizeMap: any,
  buildFolder: string,
  maxBundleGzipSize = WARN_AFTER_BUNDLE_GZIP_SIZE,
  maxChunkGzipSize = WARN_AFTER_CHUNK_GZIP_SIZE
) {
  const { root } = previousSizeMap
  const { sizes } = previousSizeMap
  const assets = (webpackStats.stats || [webpackStats])
    .map((stats: webpack.Stats) =>
      stats
        .toJson({ all: false, assets: true })
        .assets?.filter((asset: { name: string }) => canReadAsset(asset.name))
        .map((asset: { name: string }) => {
          const fileContents = fs.readFileSync(path.join(root, asset.name))
          const size = gzipSize.sync(fileContents)
          const previousSize = sizes[removeFileNameHash(root, asset.name)]
          const difference = getDifferenceLabel(size, previousSize)
          return {
            folder: path.join(path.basename(buildFolder), path.dirname(asset.name)),
            name: path.basename(asset.name),
            size,
            sizeLabel: filesize(size) + (difference ? ' (' + difference + ')' : '')
          }
        })
    )
    .reduce((single: any, all: string | any[]) => all.concat(single), [])
  assets.sort((a: { size: number }, b: { size: number }) => b.size - a.size)
  const longestSizeLabelLength = Math.max.apply(
    null,
    assets.map((a: { sizeLabel: string }) => stripAnsi(a.sizeLabel).length)
  )
  let suggestBundleSplitting = false
  assets.forEach(
    (asset: { sizeLabel: any; name: string; size: number; folder: string }) => {
      let { sizeLabel } = asset
      const sizeLength = stripAnsi(sizeLabel).length
      if (sizeLength < longestSizeLabelLength) {
        const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength)
        sizeLabel += rightPadding
      }
      const isMainBundle = asset.name.indexOf('main.') === 0
      const maxRecommendedSize = isMainBundle ? maxBundleGzipSize : maxChunkGzipSize
      const isLarge = maxRecommendedSize && asset.size > maxRecommendedSize
      if (isLarge && path.extname(asset.name) === '.js') {
        suggestBundleSplitting = true
      }
      console.log(
        '➜  ' +
          chalk.dim(`${asset.folder}${path.sep}`) +
          chalk.cyan(asset.name) +
          '  ' +
          (isLarge ? chalk.yellow(sizeLabel) : sizeLabel)
      )
    }
  )
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

export function measureFileSizesBeforeBuild(buildFolder: string) {
  return new Promise((resolve) => {
    recursive(buildFolder, (err, fileNames) => {
      let sizes = {}
      if (!err && fileNames) {
        sizes = fileNames.filter(canReadAsset).reduce((memo, fileName) => {
          const contents = fs.readFileSync(fileName)
          const key = removeFileNameHash(buildFolder, fileName)
          memo[key] = gzipSize(contents)
          return memo
        }, {})
      }
      resolve({
        root: buildFolder,
        sizes
      })
    })
  })
}
