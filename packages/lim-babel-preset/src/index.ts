import { mergeConfig } from '@lim/utils'
import path from 'path'

interface IImportPluginoptions {
  libraryName: string
  libraryDirectory?: string
  style?: boolean
  camel2DashComponentName?: boolean
}
export interface Ioptions {
  typescript?: boolean
  react?: typeof Object
  debug?: boolean
  env?: typeof Object
  transformRuntime?: typeof Object
  reactRemovePropTypes?: boolean
  dynamicImportNode?: boolean
  importToAwaitRequire?: typeof Object
  autoCSSModules?: boolean
  svgr?: typeof Object
  import?: IImportPluginoptions[]
  lockCoreJS3?: typeof Object
  modify?: <T>(value: T) => T
}

function toObject<T extends Record<string, any>>(
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
        require('@babel/preset-env').default,
        {
          ...mergeConfig(defaultEnvConfig, toObject(options.env)),
          debug: options.debug
        }
      ],
      options.react && [
        require('@babel/preset-react').default,
        toObject(options.react)
      ],
      options.typescript && [
        require('@babel/preset-typescript').default,
        {
          // https://babeljs.io/docs/en/babel-plugin-transform-typescript#impartial-namespace-support
          allowNamespaces: true
        }
      ]
    ].filter(Boolean),
    plugins: [
      // https://github.com/webpack/webpack/issues/10227
      // test?.any
      [
        require('@babel/plugin-proposal-optional-chaining').default,
        { loose: false }
      ],
      // https://github.com/webpack/webpack/issues/10227
      // test ?? []
      [
        require('@babel/plugin-proposal-nullish-coalescing-operator').default,
        { loose: false }
      ],
      require('@babel/plugin-syntax-top-level-await').default,
      // Necessary to include regardless of the environment because
      // in practice some other transforms (such as object-rest-spread)
      // don't work without it: https://github.com/babel/babel/issues/7215
      // {...} [...]
      [
        require('@babel/plugin-transform-destructuring').default,
        { loose: false }
      ],
      // https://www.npmjs.com/package/babel-plugin-transform-typescript-metadata#usage
      // should be placed before @babel/plugin-proposal-decorators.
      // @Inject()
      options.typescript && [
        require.resolve('babel-plugin-transform-typescript-metadata')
      ],
      [require('@babel/plugin-proposal-decorators').default, { legacy: true }],
      [
        require('@babel/plugin-proposal-class-properties').default,
        { loose: true }
      ],
      require('@babel/plugin-proposal-export-default-from').default,
      [
        require('@babel/plugin-proposal-pipeline-operator').default,
        {
          proposal: 'minimal'
        }
      ],
      require('@babel/plugin-proposal-do-expressions').default,
      require('@babel/plugin-proposal-function-bind').default,
      require('@babel/plugin-proposal-logical-assignment-operators').default,
      options.transformRuntime && [
        require('@babel/plugin-transform-runtime').default,
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
      options.reactRemovePropTypes && [
        require.resolve('babel-plugin-transform-react-remove-prop-types'),
        {
          removeImport: true
        }
      ],
      // import(...)
      options.dynamicImportNode && [
        require.resolve('babel-plugin-dynamic-import-node')
      ],
      // options.autoCSSModules && [
      //   require.resolve('@umijs/babel-plugin-auto-css-modules')
      // ],
      // options.svgr && [
      //   require.resolve('babel-plugin-named-asset-import'),
      //   {
      //     loaderMap: {
      //       svg: {
      //         ReactComponent: `${require.resolve(
      //           '@svgr/webpack'
      //         )}?-svgo,+titleProp,+ref![path]`
      //       }
      //     }
      //   }
      // ],
      ...(options.import
        ? options.import.map((importoptions) => {
            return [
              require.resolve('babel-plugin-import'),
              importoptions,
              importoptions.libraryName
            ]
          })
        : [])
      // options.importToAwaitRequire && [
      //   require.resolve('@umijs/babel-plugin-import-to-await-require'),
      //   options.importToAwaitRequire
      // ],
      // options.lockCoreJS3 && [
      //   require.resolve('@umijs/babel-plugin-lock-core-js-3'),
      //   options.lockCoreJS3
      // ]
    ].filter(Boolean)
  }

  return options.modify ? options.modify(preset) : preset
}
