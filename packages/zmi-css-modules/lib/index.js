"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cssExtenders = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl'];

function _default() {
  return {
    visitor: {
      ImportDeclaration(content) {
        const _content$node = content.node,
              specifiers = _content$node.specifiers,
              source = _content$node.source;
        const value = source.value;

        if (specifiers.length && cssExtenders.includes(_path().default.extname(value))) {
          source.value = `${value}?module`;
        }
      }

    }
  };
}