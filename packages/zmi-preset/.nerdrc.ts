import { IConfig } from 'zmi-nerd'
import path from 'path'

const cwd = path.join(__dirname, '../../scripts/getDefaultValue.js')

export default {
  disableTypes: true,
  afterHook() {
    require(cwd)
    console.log('zmi-preset: ➜ apply hook getDefaultValue')
  }
} as IConfig
