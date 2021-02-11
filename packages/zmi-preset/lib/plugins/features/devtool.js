"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(api) {
  api.describe({
    key: 'devtool',
    config: {
      default: api.env === 'development' ? 'eval-cheap-module-source-map' : false,

      schema(joi) {
        return joi.any().valid(joi.string(), false);
      }

    }
  });
}