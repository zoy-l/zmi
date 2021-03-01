import WebpackChain from 'webpack-chain'
import webpack from 'webpack'

import Bundler from './Bundler'
import Html from './Html'

export {
  createCSSRule,
  IConfig,
  IPrivate,
  IStyle,
  IScript,
  IScriptConfig,
  IStyleConfig
} from './types'

export { WebpackChain, webpack, Html }

export default Bundler
