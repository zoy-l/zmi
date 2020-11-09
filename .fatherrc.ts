export default {
  target: 'node',
  cjs: { type: 'babel', lazy: true },
  disableTypeCheck: true,
  pkgs: [
    'zmi-utils',
    'zmi-babel-preset',
    'zmi-create-app',
    'zmi',
    'zmi-core',
    'zmi-preset',
    'zmi-test'
  ]
}
