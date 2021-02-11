"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = api => {
  api.describe({
    key: 'chainWebpack',
    config: {
      schema(joi) {
        return joi.function();
      }

    }
  });
};

exports.default = _default;