import { launchDevice, dyo } from '@zmi-cli/utils'
import generator from './appGenerator'

const { args } = launchDevice(dyo)

;(() => {
  if (args.version && !args._[0]) {
    const { version } = require('../package')
    console.log(version)
  } else {
    generator(process.cwd(), args)
  }
})()
