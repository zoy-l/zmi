"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = servicePath;

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

function _utils() {
  const data = require("@zmi/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isDirectoryAndExist(path) {
  return _fs().default.existsSync(path) && _fs().default.statSync(path).isDirectory();
}

function normalizeWithWinPath(obj) {
  return _utils().lodash.mapValues(obj, value => (0, _utils().winPath)(value));
}

function servicePath(options) {
  var _config$outputPath;

  const cwd = options.cwd,
        config = options.config;
  let appSrcPath = cwd;

  if (isDirectoryAndExist(_path().default.join(cwd, 'src'))) {
    appSrcPath = _path().default.join(cwd, 'src');
  }

  const appPagesPath = config.singular ? _path().default.join(appSrcPath, 'page') : _path().default.join(appSrcPath, 'pages');
  return normalizeWithWinPath({
    cwd,
    appNodeModulesPath: _path().default.join(cwd, 'node_modules'),
    appOutputPath: _path().default.join(cwd, (_config$outputPath = config.outputPath) !== null && _config$outputPath !== void 0 ? _config$outputPath : './dist'),
    appSrcPath,
    appPagesPath
  });
}