import { Service } from '@zmi-cli/core'

const start = () => {
  const Signals: NodeJS.Signals[] = ['SIGINT', 'SIGQUIT', 'SIGTERM']
  try {
    const service = new Service({
      cwd: process.cwd(),
      plugins: [
        require.resolve('./miniapp.js'),
        require.resolve('./preset/afterHook.js'),
        require.resolve('./preset/beforeReadWriteStream.js'),
        require.resolve('./preset/disableTypes.js'),
        require.resolve('./preset/entry.js'),
        require.resolve('./preset/esBuild.js'),
        require.resolve('./preset/extraBabelPlugins.js'),
        require.resolve('./preset/extraBabelPresets.js'),
        require.resolve('./preset/lessOptions.js'),
        require.resolve('./preset/output.js'),
        require.resolve('./preset/paths.js')
      ]
    })

    service.run({
      command: 'miniapp'
    })

    Signals.forEach((signal) => {
      process.once(signal, () => {
        process.exit(0)
      })
    })
  } catch (e) {
    console.error(e.message)
    console.error(e.stack)
    process.exit(1)
  }
}
start()
