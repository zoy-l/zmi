"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseRequireDeps;

function _crequire() {
  const data = _interopRequireDefault(require("crequire"));

  _crequire = function _crequire() {
    return data;
  };

  return data;
}

function _resolve() {
  const data = _interopRequireDefault(require("resolve"));

  _resolve = function _resolve() {
    return data;
  };

  return data;
}

function _lodash() {
  const data = _interopRequireDefault(require("lodash"));

  _lodash = function _lodash() {
    return data;
  };

  return data;
}

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function parse(filePath) {
  const content = _fs().default.readFileSync(filePath, 'utf-8');

  return (0, _crequire().default)(content).filter(item => item.path.charAt(0) === '.' && (0, _winPath.default)(_resolve().default.sync(item.path, {
    basedir: _path().default.dirname(filePath),
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  })));
}

function parseRequireDeps(filePath) {
  const paths = [filePath];
  const ret = [(0, _winPath.default)(filePath)];

  while (paths.length) {
    // Avoid relying on circular references
    const extraPaths = _lodash().default.pullAll(parse(paths.shift()), ret);

    if (extraPaths.length) {
      paths.push(...extraPaths);
      ret.push(...extraPaths);
    }
  }

  return ret;
}