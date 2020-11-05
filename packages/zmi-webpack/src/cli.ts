import { getArgs } from '@zmi/utils'
// import { paths } from '../../zmi-utils/lib'

const args = getArgs()
const command = args._[0]
// const cwd = paths(args.cwd || '')
const env = args.env || (command === 'dev' ? 'development' : 'production')
process.env.NODE_ENV = env

if (args.version && !command) {
  //
}

;(() => {})()
