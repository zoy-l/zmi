import { winPath } from '@zmi/utils'
import path from 'path'
import fs from 'fs'

type env = 'development' | 'production'

interface IOpts {
  config: any
  env: 'development' | 'production'
  targets?: Record<string, unknown>
}

function getBasicBabelLoaderOpts({ cwd }: { cwd: string }) {
  const prefix = fs.existsSync(path.join(cwd, 'src'))
    ? path.join(cwd, 'src')
    : cwd
  return {
    // Tell babel to guess the type, instead assuming all files are modules
    // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
    sourceType: 'unambiguous',
    babelrc: false,
    cacheDirectory:
      process.env.BABEL_CACHE !== 'none'
        ? winPath(`${prefix}/.umi/.cache/babel-loader`)
        : false
  }
}

export function getBabelPresetOpts(opts: IOpts) {
  return {
    nodeEnv: opts.env,
    dynamicImportNode: !opts.config.dynamicImport,
    autoCSSModules: true,
    svgr: true,
    env: {
      targets: opts.targets
    },
    import: []
  }
}

export function getBabelOpts({
  cwd,
  config,
  presetOpts
}: {
  cwd: string
  config: any
  presetOpts: Record<string, unknown>
}) {
  return {
    ...getBasicBabelLoaderOpts({ cwd }),
    presets: [
      [require.resolve('@zmi/babel-preset/app'), presetOpts],
      ...(config.extraBabelPresets ?? [])
    ],
    plugins: [...(config.extraBabelPlugins ?? [])].filter(Boolean)
  }
}

export function getBabelDepsOpts({
  env,
  cwd,
  config
}: {
  env: env
  cwd: string
  config: any
}) {
  return {
    ...getBasicBabelLoaderOpts({ cwd }),
    presets: [
      [
        require.resolve('@zmi/babel-preset/dependency'),
        {
          nodeEnv: env,
          dynamicImportNode: !config.dynamicImport
        }
      ]
    ]
  }
}
