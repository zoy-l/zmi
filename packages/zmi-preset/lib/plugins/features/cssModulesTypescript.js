"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = api => {
  api.describe({
    key: 'cssModulesTypescript',
    config: {
      schema(joi) {
        return joi.object({
          mode: joi.string().valid('emit', 'verify').optional()
        });
      }

    }
  });
};

exports.default = _default;