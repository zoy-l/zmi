import joi from 'joi'

export default joi.object({
  pkgs: joi.array(),
  disableTypeCheck: joi.boolean(),
  target: joi.string().valid('node', 'browser').optional()
})
