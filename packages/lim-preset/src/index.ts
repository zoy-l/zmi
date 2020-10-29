export default () => {
  return {
    plugins: [
      require.resolve('./plugins'),
      require.resolve('./plugins/commands/dev')
    ]
  }
}
