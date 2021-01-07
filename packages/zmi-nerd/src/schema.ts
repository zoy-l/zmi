import Joi from 'joi'

export default Joi.object({
  pkgs: Joi.array(),
  disableTypeCheck: Joi.boolean(),
  nodeVersion: Joi.number(),
  target: Joi.string().valid('node', 'browser'),
  moduleType: Joi.string().valid('esm', 'cjs'),
  moduleOptions: Joi.object({
    lazy: Joi.boolean()
  }),
  runtimeHelpers: Joi.boolean(),
  extraBabelPlugins: Joi.array().items(Joi.any()),
  extraBabelPresets: Joi.array().items(Joi.any()),
  extraPostCSSPlugins: Joi.array().items(Joi.any()),
  typescriptOpts: Joi.object(),
  nodeFiles: Joi.array().items(Joi.string()),
  browserFiles: Joi.array().items(Joi.string()),
  entry: Joi.string().default('src'),
  output: Joi.string().default('lib')
})
