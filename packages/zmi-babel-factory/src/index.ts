import { deepmerge } from '@zmi-cli/utils'
import path from 'path'

export interface Ioptions {
  type?: 'node' | 'react' | 'vue'
  typescript?: boolean
  react?: Record<string, any>
  debug?: boolean
  env?: Record<string, any>
  transformRuntime?: Record<string, any>
  dynamicImportNode?: boolean
  autoCSSModules?: boolean
  modify?: <T>(value: T) => T
}

export function isObject<T extends Record<string, any>>(
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
      'transform-literals',
      options.type === 'node' && 'transform-regenerator'
    ].filter(Boolean)
  }

  const preset = {
    presets: [
      options.env && [
        require.resolve('@babel/preset-env'),
        {
          ...deepmerge(defaultEnvConfig, isObject(options.env)),
          debug: options.debug
        }
      ],
      options.typescript && [
        require.resolve('@babel/preset-typescript'),
        {
          allowNamespaces: true
        }
      ]
    ].filter(Boolean),
    plugins: [
      [require.resolve('@babel/plugin-proposal-optional-chaining'), { loose: false }],
      [
        require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
        { loose: false }
      ],
      require.resolve('@babel/plugin-syntax-top-level-await'),
      [require.resolve('@babel/plugin-transform-destructuring'), { loose: false }],
      options.typescript && [
        require.resolve('babel-plugin-transform-typescript-metadata')
      ],
      [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
      require.resolve('@babel/plugin-proposal-export-default-from'),
      [
        require.resolve('@babel/plugin-proposal-pipeline-operator'),
        {
          proposal: 'minimal'
        }
      ],
      require.resolve('@babel/plugin-proposal-do-expressions'),
      require.resolve('@babel/plugin-proposal-function-bind'),
      require.resolve('@babel/plugin-proposal-logical-assignment-operators'),
      options.transformRuntime && [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          version: require('@babel/runtime/package.json').version,
          absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json')),
          useESModules: true,
          ...isObject(options.transformRuntime)
        }
      ],
      options.autoCSSModules && [require.resolve('@zmi-cli/css-modules')],
      options.dynamicImportNode && [require.resolve('babel-plugin-dynamic-import-node')]
    ].filter(Boolean)
  }

  return options.modify ? options.modify(preset) : preset
}
