"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _lodash() {
  const data = _interopRequireDefault(require("lodash"));

  _lodash = function _lodash() {
    return data;
  };

  return data;
}

var _winPath = _interopRequireDefault(require("./winPath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BabelRegister {
  constructor() {
    this.only = {};
  }

  setOnlyMap({
    key,
    value
  }) {
    this.only[key] = value;
    this.register();
  }

  register() {
    const only = _lodash().default.uniq(Object.keys(this.only).reduce((memo, key) => memo.concat(this.only[key]), []).map(_winPath.default));

    require('@babel/register')({
      presets: [require.resolve('@zmi/babel-preset/node')],
      ignore: [/node_modules/],
      only,
      extensions: ['.jsx', '.js', '.ts', '.tsx'],
      babelrc: false,
      cache: false
    });
  }

}

exports.default = BabelRegister;