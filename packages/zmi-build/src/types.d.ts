export interface ICjs {
  minify?: boolean
  lazy?: boolean
}

interface IEsm {
  mjs?: boolean
  minify?: boolean
}

interface IUmd {
  minFile?: boolean
  sourcemap?: boolean
}

export interface IBundleOptions {
  esm?: IEsm | false
  cjs?: ICjs | false
  umd?: IUmd | false
  extraBabelPlugins?: any[]
  extraBabelPresets?: any[]
  extraPostCSSPlugins?: any[]
  runtimeHelpers?: boolean
  target?: 'node' | 'browser'
  browserFiles?: {
    [value: string]: any
  }
  nodeFiles?: {
    [value: string]: any
  }
  nodeVersion?: number
  disableTypeCheck?: boolean
  typescriptOpts?: {
    [value: string]: any
  }
  nodeResolveOpts?: {
    [value: string]: any
  }
  pkgs?: string[]
}
