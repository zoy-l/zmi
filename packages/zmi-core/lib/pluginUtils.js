"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pathToRegister = pathToRegister;
exports.resolvePlugins = resolvePlugins;
exports.isPromise = isPromise;

function _utils() {
  const data = require("@zmi-cli/utils");

  _utils = function _utils() {
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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPlugins(opts) {
  var _opts$plugins, _opts$userConfigPlugi;

  return [(_opts$plugins = opts.plugins) !== null && _opts$plugins !== void 0 ? _opts$plugins : [], (_opts$userConfigPlugi = opts.userConfigPlugins) !== null && _opts$userConfigPlugi !== void 0 ? _opts$userConfigPlugi : []].flat().map(path => _utils().resolve.sync(path, {
    basedir: opts.cwd,
    extensions: ['.js', '.ts']
  }));
}

function nameToKey(name) {
  return name.split('.').map(part => _utils().lodash.camelCase(part)).join('.');
}

function pkgNameToKey(pkgName) {
  // strip none @zmi-cli scope
  if (pkgName.charAt(0) === '@' && !pkgName.startsWith('@zmi-cli/')) {
    pkgName = pkgName.split('/')[1];
  }

  return nameToKey(pkgName.replace(/^(@zmi-cli\/|zmi-)plugin-/, ''));
}

function pathToRegister({
  path: pluginPath,
  cwd
}) {
  let pkg = null;
  let isPkgPlugin = false;
  (0, _utils().assert)(`${pluginPath} not exists, pathToRegister failed`, _fs().default.existsSync(pluginPath));

  const pkgJSONPath = _utils().pkgUp.sync({
    cwd: pluginPath
  });

  if (pkgJSONPath) {
    pkg = require(pkgJSONPath);
    isPkgPlugin = (0, _utils().winPath)(_path().default.join(_path().default.dirname(pkgJSONPath), pkg.main || 'index.js')) === (0, _utils().winPath)(pluginPath);
  }

  let id;

  if (isPkgPlugin) {
    id = pkg.name;
  } else if ((0, _utils().winPath)(pluginPath).startsWith((0, _utils().winPath)(cwd))) {
    id = `./${(0, _utils().winPath)(_path().default.relative(cwd, pluginPath))}`;
  } else if (pkgJSONPath) {
    id = (0, _utils().winPath)(_path().default.join(pkg.name, _path().default.relative(_path().default.dirname(pkgJSONPath), pluginPath)));
  } else {
    id = (0, _utils().winPath)(pluginPath);
  }

  id = id.replace('@zmi-cli/preset/lib/plugins', '@@');
  id = id.replace(/\.js$/, '');
  let key;

  if (isPkgPlugin) {
    key = pkgNameToKey(pkg.name);
  } else {
    const pathParse = _path().default.parse(pluginPath);

    if (pathParse.name === 'index') {
      const sep = pathParse.dir.split(_path().default.sep);
      key = sep[sep.length - 1];
    } else {
      key = nameToKey(_path().default.basename(pluginPath, _path().default.extname(pluginPath)));
    }
  }

  return {
    id,
    key,
    path: (0, _utils().winPath)(pluginPath),

    apply() {
      try {
        const ret = require(pluginPath);

        return (0, _utils().compatibleWithESModule)(ret);
      } catch (err) {
        (0, _utils().assert)(`Register ${pluginPath} failed, since ${err.message}`);
      }
    }

  };
}

function resolvePlugins(opts) {
  let plugins = getPlugins(opts);
  plugins = [...plugins];
  return plugins.map(path => pathToRegister({
    path,
    cwd: opts.cwd
  }));
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}