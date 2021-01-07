export interface IBundleOptions {
  moduleOptions?: {
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
  entry?: string
  output?: string
}

export interface IBundleOpt extends IBundleOptions {
  entry: string
  output: string
}
