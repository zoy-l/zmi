"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFile;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function _fs() {
    return data;
  };

  return data;
}

var _winPath = _interopRequireDefault(require("./winPath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const extsMap = {
  javascript: ['.ts', '.tsx', '.js', '.jsx'],
  css: ['.less', '.sass', '.scss', '.stylus', '.css']
};
/**
 * Try to match the exact extname of the file in a specific directory.
 * @returns
 * - matched: `{ path: string; filename: string }`
 * - otherwise: `null`
 */

function getFile(opts) {
  const exts = extsMap[opts.type];
  const ex = [...exts]; // why while instead of for-x ?
  // because eslint prompts that you cannot use for-x
  // `eslint no-restricted-syntax`
  // and i don't want to ban it 😑

  while (ex.length) {
    const filename = `${opts.fileNameWithoutExt}${ex.shift()}`;
    const paths = (0, _winPath.default)(_path().default.join(opts.base, filename));

    if (_fs().default.existsSync(paths)) {
      return {
        path: _path().default,
        filename
      };
    }
  }

  return null;
}