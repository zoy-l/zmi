export default () => {
  return [
    require.resolve('./plugins/registerMethods'),
    require.resolve('./plugins/commands/dev')
  ]
}
