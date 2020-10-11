import { getArgs } from '@lim/cli-utils'
import { paths } from '@lim/cli-utils/src'

const args = getArgs()
const command = args._[0]
const cwd = paths(args.cwd || '')
const env = args.env || (command === 'dev' ? 'development' : 'production')
process.env.NODE_ENV = env

if (args.version && !command) {
  //
}


(() =>{

})()
