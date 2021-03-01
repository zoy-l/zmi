export default (api) => {
  api.describe({
    key: 'outputPath',
    config: {
      default: 'dist',
      schema(joi) {
        return joi.string()
      }
    }
  })
}
