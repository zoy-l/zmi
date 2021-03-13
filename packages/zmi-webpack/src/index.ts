import WebpackChain from 'webpack-chain'
import webpack from 'webpack'

import Bundler from './Bundler'
import html from './Html'

export {
  createCSSRule,
  IConfig,
  IPrivate,
  IStyle,
  IScript,
  IScriptConfig,
  IStyleConfig,
  IModifyHTML
} from './types'

export { WebpackChain, webpack, html }

export default Bundler
