export default {
  target: 'node',
  cjs: { type: 'babel', lazy: true },
  disableTypeCheck: true,
  pkgs: ['lim-utils', 'lim-create-app', 'lim', 'lim-core', 'lim-preset']
}
