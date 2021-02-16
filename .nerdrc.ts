import { IConfig } from 'zmi-nerd'

export default {
  moduleType: 'cjs',
  target: 'node',
  pkgs: [
    'zmi-utils',
    'zmi-babel-factory',
    'zmi-css-modules',
    'zmi-create-app',
    'zmi-core',
    'zmi-types',
    'zmi',
    'zmi-webpack',
    'zmi-preset'
  ]
  // sourceMaps: true
} as IConfig
