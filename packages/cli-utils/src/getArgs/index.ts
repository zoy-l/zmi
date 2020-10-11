import yargsParser from 'yargs-parser'

export default (opts?: yargsParser.Options) => {
  return yargsParser(
    process.argv.slice(2),
    opts || {
      alias: {
        version: ['v'],
        help: ['h']
      },
      boolean: ['version']
    }
  )
}
