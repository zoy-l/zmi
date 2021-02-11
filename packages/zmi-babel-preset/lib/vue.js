"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ = _interopRequireDefault(require("."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(_context, opts) {
  return {
    presets: [[_.default, opts]],
    plugins: [require.resolve('@vue/babel-plugin-jsx')]
  };
}