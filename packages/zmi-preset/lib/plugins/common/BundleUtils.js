"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBundleAndConfigs = getBundleAndConfigs;

function _webpack() {
  const data = _interopRequireDefault(require("@zmi/webpack"));

  _webpack = function _webpack() {
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

var _generateHtml = require("./generateHtml");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function getBundleAndConfigs(_x) {
  return _getBundleAndConfigs.apply(this, arguments);
}

function _getBundleAndConfigs() {
  _getBundleAndConfigs = _asyncToGenerator(function* (options) {
    var _find;

    const api = options.api,
          port = options.port;
    const Html = (0, _generateHtml.getHtmlGenerator)({
      api
    });
    const htmlContent = yield Html.getContent(); // Apply webpack launcher to get an instance
    // Also used to switch between different build tools
    // Built-in device by default

    const Bundler = yield api.applyPlugins({
      type: api.ApplyPluginsType.modify,
      key: 'modifyBundler',
      initialValue: _webpack().default
    }); // Used to get webpack instance
    // No changes are made here, but developers may change
    // Use built-in webpack by default

    const bundleImplementor = yield api.applyPlugins({
      key: 'modifyBundleImplementor',
      type: api.ApplyPluginsType.modify,
      initialValue: undefined
    }); // Initialize the webpack launcher

    const bundler = new Bundler({
      cwd: api.cwd,
      config: api.config,
      pkg: api.pkg
    });
    const bundlerArgs = {
      env: api.env,
      bundler: {
        id: Bundler.id,
        version: Bundler.version
      }
    };

    const getArgs = otps => ({
      args: _objectSpread(_objectSpread({}, otps), {}, {
        bundlerArgs
      })
    });

    const entryFilePath = (_find = ['index.jsx', 'index.tsx', 'index.ts', 'index.js'].find(file => _fs().default.existsSync(_path().default.join(api.paths.appSrcPath, file)))) !== null && _find !== void 0 ? _find : 'index.js';

    function getConfig() {
      return _getConfig.apply(this, arguments);
    }

    function _getConfig() {
      _getConfig = _asyncToGenerator(function* () {
        var _api$env;

        const getConfigOpts = yield api.applyPlugins({
          type: api.ApplyPluginsType.modify,
          key: 'modifyBundleConfigOpts',
          initialValue: {
            env: (_api$env = api.env) !== null && _api$env !== void 0 ? _api$env : process.env.NODE_ENV,
            port,
            entry: {
              main: _path().default.join(api.paths.appSrcPath, entryFilePath)
            },
            hot: process.env.HMR !== 'none',
            bundleImplementor,
            htmlContent,

            modifyBabelOpts(opts) {
              return _asyncToGenerator(function* () {
                return api.applyPlugins({
                  type: api.ApplyPluginsType.modify,
                  key: 'modifyBabelOpts',
                  initialValue: opts
                });
              })();
            },

            modifyBabelPresetOpts(opts) {
              return _asyncToGenerator(function* () {
                return api.applyPlugins({
                  type: api.ApplyPluginsType.modify,
                  key: 'modifyBabelPresetOpts',
                  initialValue: opts
                });
              })();
            },

            chainWebpack(webpackConfig, opts) {
              return _asyncToGenerator(function* () {
                return api.applyPlugins({
                  type: api.ApplyPluginsType.modify,
                  key: 'chainWebpack',
                  initialValue: webpackConfig,
                  args: _objectSpread({}, opts)
                });
              })();
            }

          },
          args: getArgs({})
        });
        return api.applyPlugins({
          type: api.ApplyPluginsType.modify,
          key: 'modifyBundleConfig',
          initialValue: yield bundler.getConfig(getConfigOpts),
          args: getArgs({})
        });
      });
      return _getConfig.apply(this, arguments);
    }

    const bundleConfigs = yield api.applyPlugins({
      type: api.ApplyPluginsType.modify,
      key: 'modifyBundleConfigs',
      initialValue: yield getConfig(),
      args: getArgs({
        getConfig
      })
    });
    return {
      bundleImplementor,
      bundleConfigs,
      bundler
    };
  });
  return _getBundleAndConfigs.apply(this, arguments);
}