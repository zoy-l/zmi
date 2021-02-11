"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(api) {
  api.describe({
    key: 'loaderOptions',
    config: {
      default: {
        less: {},
        scss: {},
        stylus: {}
      },

      schema(joi) {
        return joi.object({
          less: joi.object(),
          scss: joi.object(),
          stylus: joi.object(),
          styleLoader: joi.object()
        });
      }

    }
  });
}