import { mergeConfig } from '@zmi/utils'
import path from 'path'

export interface Ioptions {
  typescript?: boolean
  react?: Record<string, any>
  debug?: boolean
  env?: Record<string, any>
  transformRuntime?: Record<string, any>
  dynamicImportNode?: boolean
  autoCSSModules?: boolean
  modify?: <T>(value: T) => T
}

export function toObject<T extends Record<string, any>>(
  obj: T | boolean
): T | Partial<T> {
  return typeof obj === 'object' ? obj : {}
}

export default (_context: never, options: Ioptions) => {
  const defaultEnvConfig = {
    exclude: [
      'transform-typeof-symbol',
      'transform-unicode-regex',
      'transform-sticky-regex',
      'transform-new-target',
      'transform-modules-umd',
      'transform-modules-systemjs',
      'transform-modules-amd',
      'transform-literals'
    ]
  }

  const preset = {
    presets: [
      options.env && [
        '@babel/preset-env',
        {
          ...mergeConfig(defaultEnvConfig, toObject(options.env)),
          debug: options.debug
        }
      ],
      options.typescript && [
        '@babel/preset-typescript',
        {
          allowNamespaces: true
        }
      ]
    ].filter(Boolean),
    plugins: [
      ['@babel/plugin-proposal-optional-chaining', { loose: false }],
      ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],
      '@babel/plugin-syntax-top-level-await',
      ['@babel/plugin-transform-destructuring', { loose: false }],
      options.typescript && ['babel-plugin-transform-typescript-metadata'],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      '@babel/plugin-proposal-export-default-from',
      [
        '@babel/plugin-proposal-pipeline-operator',
        {
          proposal: 'minimal'
        }
      ],
      '@babel/plugin-proposal-do-expressions',
      '@babel/plugin-proposal-function-bind',
      '@babel/plugin-proposal-logical-assignment-operators',
      options.transformRuntime && [
        '@babel/plugin-transform-runtime',
        {
          version: require('@babel/runtime/package.json').version,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#absoluteruntime
          // lock the version of @babel/runtime
          // make sure we are using the correct version
          absoluteRuntime: path.dirname(
            require.resolve('@babel/runtime/package.json')
          ),
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          useESModules: true,
          ...toObject(options.transformRuntime)
        }
      ],
      options.autoCSSModules && [require.resolve('@zmi/css-modules')],
      options.dynamicImportNode && ['babel-plugin-dynamic-import-node']
    ].filter(Boolean)
  }

  return options.modify ? options.modify(preset) : preset
}
