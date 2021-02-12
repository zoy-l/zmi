"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _webpackDevServer() {
  const data = _interopRequireDefault(require("webpack-dev-server"));

  _webpackDevServer = function _webpackDevServer() {
    return data;
  };

  return data;
}

function _utils() {
  const data = require("@zmi-cli/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _webpack() {
  const data = _interopRequireDefault(require("webpack"));

  _webpack = function _webpack() {
    return data;
  };

  return data;
}

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function _fsExtra() {
    return data;
  };

  return data;
}

var _createCompiler = _interopRequireWildcard(require("./createCompiler"));

var _formatWebpackMessages = _interopRequireDefault(require("./formatWebpackMessages"));

var _getConfig = _interopRequireDefault(require("./getConfig"));

var _reporterFileSize = require("./reporterFileSize");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

class Bundler {
  constructor({
    cwd,
    config,
    pkg
  }) {
    this.pkg = {};
    this.cwd = cwd;
    this.config = config;
    this.pkg = pkg;
  }

  getConfig(options) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return (0, _getConfig.default)(_objectSpread(_objectSpread({}, options), {}, {
        cwd: _this.cwd,
        config: _this.config,
        pkg: _this.pkg
      }));
    })();
  }

  setupDevServer(options) {
    return _asyncToGenerator(function* () {
      const bundleConfigs = options.bundleConfigs,
            _options$bundleImplem = options.bundleImplementor,
            bundleImplementor = _options$bundleImplem === void 0 ? _webpack().default : _options$bundleImplem,
            _options$appName = options.appName,
            appName = _options$appName === void 0 ? 'project' : _options$appName,
            host = options.host,
            port = options.port;
      const urls = (0, _createCompiler.prepareUrls)({
        host,
        port
      });
      const devServerConfig = bundleConfigs.devServer;
      const compiler = (0, _createCompiler.default)({
        config: bundleConfigs,
        bundleImplementor,
        appName,
        urls,
        port
      });
      const devServer = new (_webpackDevServer().default)(compiler, devServerConfig);
      return devServer;
    })();
  }

  build(options) {
    return _asyncToGenerator(function* () {
      const _options$bundleImplem2 = options.bundleImplementor,
            bundleImplementor = _options$bundleImplem2 === void 0 ? _webpack().default : _options$bundleImplem2,
            bundleConfigs = options.bundleConfigs,
            appOutputPath = options.appOutputPath;
      (0, _utils().clearConsole)();
      console.log(_utils().chalk.redBright('Start packing, please don’t worry, officer...\n'));
      const previousFileSizes = yield (0, _reporterFileSize.measureFileSizesBeforeBuild)(appOutputPath);

      _fsExtra().default.emptyDirSync(appOutputPath);

      return new Promise(resolve => {
        const compiler = bundleImplementor(bundleConfigs);
        compiler.run((err, stats) => {
          let messages;

          if (err) {
            if (!err.message) {
              throw new Error('build fail');
            }

            messages = (0, _formatWebpackMessages.default)({
              errors: [err.message],
              warnings: []
            });
          } else {
            messages = stats ? (0, _formatWebpackMessages.default)(stats.toJson({
              all: false,
              warnings: true,
              errors: true
            })) : {
              errors: [],
              warnings: []
            };
          }

          if (messages.errors.length) {
            if (messages.errors.length > 1) {
              messages.errors.length = 1;
            }

            throw new Error(messages.errors.join('\n\n'));
          }

          if (messages.warnings.length) {
            console.warn(messages.warnings.join('\n'));
          } else {
            (0, _utils().clearConsole)();
            console.log(`📦 ${_utils().chalk.yellowBright('Compiled successfully !')} Size: - Gzip \n`);
          }

          (0, _reporterFileSize.printFileSizesAfterBuild)(stats, previousFileSizes, appOutputPath);
          console.log();
          resolve(stats);
        });
      });
    })();
  }

}

exports.default = Bundler;