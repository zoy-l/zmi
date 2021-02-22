import WebpackChain from 'webpack-chain'
import webpack from 'webpack'

import Bundler from './Bundler'

export {
  createCSSRule,
  IConfig,
  IPrivate,
  IStyle,
  IScript,
  IScriptConfig,
  IStyleConfig
} from './types'
export { WebpackChain, webpack }

export default Bundler
