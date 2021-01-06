export interface IBundleOptions {
  moduleOptions?: {
    minFile?: boolean
    sourcemap?: boolean
    mjs?: boolean
    minify?: boolean
    lazy?: boolean
  }
  moduleType?: 'esm' | 'cjs'
  extraBabelPlugins?: any[]
  extraBabelPresets?: any[]
  extraPostCSSPlugins?: any[]
  target?: 'node' | 'browser'
  browserFiles?: string[]
  nodeFiles?: string[]
  nodeVersion?: number
  runtimeHelpers?: boolean
  disableTypeCheck?: boolean
  typescriptOpts?: Record<string, any>
  pkgs?: string[]
}
