export default {
  target: 'node',
  cjs: { type: 'babel', lazy: true },
  disableTypeCheck: true,
  pkgs: [
    'zmi-utils',
    'zmi-types',
    'zmi-babel-preset',
    'zmi-create-app',
    'zmi',
    'zmi-core',
    'zmi-preset',
    'zmi-test',
    'zmi-webpack'
  ]
}
