export default () => [
  require.resolve('./plugins/registerMethods'),
  require.resolve('./plugins/commands/dev'),

  require.resolve('./plugins/features/cssModulesTypescript'),
  require.resolve('./plugins/features/favicon')
]
