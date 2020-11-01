export default () => {
  return [
    require.resolve('./plugins'),
    require.resolve('./plugins/commands/dev')
  ]
}
