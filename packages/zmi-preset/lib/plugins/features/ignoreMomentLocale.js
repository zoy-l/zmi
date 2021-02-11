"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(api) {
  api.describe({
    key: 'ignoreMomentLocale',
    config: {
      schema(joi) {
        return joi.boolean();
      }

    }
  });
}