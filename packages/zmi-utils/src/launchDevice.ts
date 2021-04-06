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
): { args: yargsParser.Arguments; command: string } => {
  const args = yargsParser(process.argv.slice(2), opts)
  return { args, command: args._[0] }
}
