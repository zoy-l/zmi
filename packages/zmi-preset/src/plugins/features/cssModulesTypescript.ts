export default (api: any) => {
  api.describe({
    key: 'cssModulesTypescript',
    config: {
      schema(joi: any) {
        return joi.object({
          mode: joi.string().valid('emit', 'verify').optional()
        })
      }
    }
  })
}
