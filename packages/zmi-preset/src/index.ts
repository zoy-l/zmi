export default () => [
  require.resolve('./plugins/registerMethods'),
  require.resolve('./plugins/commands/dev'),
  require.resolve('./plugins/commands/webDev'),
  require.resolve('./plugins/commands/miniappDev'),

  require.resolve('./plugins/features/frameType'),
  require.resolve('./plugins/features/frameOptions'),
  require.resolve('./plugins/features/miniAppConfig'),
  require.resolve('./plugins/features/cssModulesTypescript'),
  require.resolve('./plugins/features/favicon')
]
