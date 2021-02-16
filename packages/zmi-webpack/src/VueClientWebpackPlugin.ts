import { Compiler, ProvidePlugin, EntryNormalized } from 'webpack'

function isSocketEntry(entry: string | string[]) {
  const socketEntries = [
    'webpack-dev-server/client',
    'webpack-hot-middleware/client',
    'webpack-plugin-serve/client',
    'react-dev-utils/webpackHotDevClient'
  ]

  return socketEntries.some((socketEntry) => entry.includes(socketEntry))
}

type IEntry = (...args: any[]) => any

export default class VueClient {
  apply(compiler: Compiler) {
    compiler.options.entry = this.injectRefreshEntry(compiler.options.entry)

    const providePlugin = new ProvidePlugin({
      __react_refresh_error_overlay__: require.resolve(
        '@pmmmwh/react-refresh-webpack-plugin/overlay'
      ),
      __react_refresh_init_socket__: require.resolve(
        '@pmmmwh/react-refresh-webpack-plugin/sockets/WDSSocket'
      )
    })

    providePlugin.apply(compiler)
  }

  injectRefreshEntry(originalEntry: EntryNormalized): any {
    const overlayEntries = [
      require.resolve('@pmmmwh/react-refresh-webpack-plugin/client/LegacyWDSSocketEntry'),
      require.resolve('@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry')
    ]

    if (typeof originalEntry === 'string') {
      if (isSocketEntry(originalEntry)) {
        return [originalEntry, ...overlayEntries]
      }

      return [...overlayEntries, originalEntry]
    }

    if (Array.isArray(originalEntry)) {
      const socketEntryIndex = originalEntry.findIndex(isSocketEntry)

      let socketAndPrecedingEntries = []
      if (socketEntryIndex !== -1) {
        socketAndPrecedingEntries = originalEntry.splice(0, socketEntryIndex + 1)
      }

      return [...socketAndPrecedingEntries, ...overlayEntries, ...originalEntry]
    }

    if (typeof originalEntry === 'object') {
      return Object.entries(originalEntry as Record<string, any>).reduce(
        (acc, [curKey, curEntry]) => ({
          ...acc,
          [curKey]:
            typeof curEntry === 'object' && curEntry.import
              ? {
                  ...curEntry,
                  import: this.injectRefreshEntry(curEntry.import)
                }
              : this.injectRefreshEntry(curEntry)
        }),
        {}
      )
    }

    if (typeof originalEntry === 'function') {
      return (...args: any) =>
        Promise.resolve((<IEntry>originalEntry)(...args)).then((resolvedEntry) =>
          this.injectRefreshEntry(resolvedEntry)
        )
    }

    const { createError } = require('@pmmmwh/react-refresh-webpack-plugin/lib/utils')

    throw createError('Failed to parse the Webpack `entry` object!')
  }
}
