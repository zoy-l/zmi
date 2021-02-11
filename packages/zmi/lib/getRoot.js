"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCwd = getCwd;
exports.getPkg = getPkg;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCwd() {
  const cwd = process.cwd();

  if (process.env.APP_ROOT) {
    // avoid repeat cwd path
    if (!_path().default.isAbsolute(process.env.APP_ROOT)) {
      return _path().default.join(cwd, process.env.APP_ROOT);
    }

    return process.env.APP_ROOT;
  }

  return cwd;
}

function getPkg(dir) {
  try {
    return require(_path().default.join(getCwd(), 'package.json'));
  } catch (error) {
    try {
      return require(_path().default.join(dir, 'package.json'));
    } catch (error) {
      return null;
    }
  }
}