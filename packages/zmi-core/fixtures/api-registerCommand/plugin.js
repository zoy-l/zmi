const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = (api) => {
  api.registerCommand({
    name: 'build',
    fn: async ({ args }) => {
      await delay(100)
      let str = `hello ${args.projectName} `
      if (Array.isArray(args._)) {
        str += args._.join(',')
      }

      return str
    }
  })
}
