import type { IBundleOptions } from './types'

export default function getBabelConfig(
  bundleOpts: Omit<IBundleOptions, 'entry' | 'output'>
) {
  const {
    target,
    nodeVersion,
    moduleType,
    runtimeHelpers,
    moduleOptions = {}
  } = bundleOpts

  const isBrowser = target === 'browser'

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: isBrowser
            ? { browsers: ['>0.2%', 'not ie 11', 'not op_mini all'] }
            : { node: nodeVersion ?? 8 },
          modules: moduleType === 'esm' ? false : 'auto'
        }
      ]
    ] as (string | any[])[],
    plugins: [
      moduleType === 'cjs' &&
        !isBrowser && [
          '@babel/plugin-transform-modules-commonjs',
          { lazy: moduleOptions?.lazy ?? true }
        ],
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-do-expressions',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-syntax-dynamic-import',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      runtimeHelpers && [
        '@babel/plugin-transform-runtime',
        {
          useESModules: isBrowser && moduleType === 'esm',
          version: require('@babel/runtime/package.json').version
        }
      ]
    ].filter(Boolean) as (string | any[])[]
  }
}
