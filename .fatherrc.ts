export default {
  target: 'node',
  cjs: { type: 'babel', lazy: true },
  disableTypeCheck: true,
  pkgs: ['cli-utils', 'create-lim-app', 'lim', 'cli-core']
}
