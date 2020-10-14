import yargs from 'yargs'
import yargsParser from 'yargs-parser'

export const defaultYargsOptions = {
  alias: {
    version: ['v'],
    help: ['h']
  },
  boolean: ['version']
}

export default (
  opts?: yargsParser.Options
): Promise<{ args: yargs.Arguments; command: string }> => {
  return new Promise((resolve, reject) => {
    try {
      const args = yargsParser(process.argv.slice(2), opts)
      resolve({ args, command: args._[0] })
    } catch (err) {
      reject(err)
    }
  })
}
