import Joi from 'joi'

export default Joi.object({
  pkgs: Joi.array(),
  disableTypeCheck: Joi.boolean(),
  nodeVersion: Joi.number(),
  target: Joi.string().valid('node', 'browser'),
  moduleType: Joi.string().valid('ems', 'cjs'),
  moduleOptions: Joi.object({
    minify: Joi.boolean(),
    lazy: Joi.boolean(),
    mjs: Joi.boolean()
  }),
  extraBabelPlugins: Joi.array().items(Joi.any()),
  extraBabelPresets: Joi.array().items(Joi.any()),
  extraPostCSSPlugins: Joi.array().items(Joi.any()),
  typescriptOpts: Joi.object(),
  nodeFiles: Joi.array().items(Joi.string()),
  browserFiles: Joi.array().items(Joi.string())
})
