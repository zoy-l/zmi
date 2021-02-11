"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _schema() {
  const data = _interopRequireDefault(require("zmi-nerd/lib/schema"));

  _schema = function _schema() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(api) {
  api.describe({
    key: 'miniAppConfig',
    config: {
      schema() {
        return _schema().default;
      }

    }
  });
}