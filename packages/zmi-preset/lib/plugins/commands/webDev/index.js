"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _utils() {
  const data = require("@zmi/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

var _BundleUtils = require("../../common/BundleUtils");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = api => {
  let port;
  let host;
  api.registerCommand({
    name: 'webDev',
    description: 'start a webDev server for development',
    fn: function () {
      var _fn = _asyncToGenerator(function* ({
        args
      }) {
        var _ref, _process$env$PORT, _api$config$devServer, _ref2, _process$env$HOST, _api$config$devServer2;

        const defaultPort = (_ref = (_process$env$PORT = process.env.PORT) !== null && _process$env$PORT !== void 0 ? _process$env$PORT : args === null || args === void 0 ? void 0 : args.port) !== null && _ref !== void 0 ? _ref : (_api$config$devServer = api.config.devServer) === null || _api$config$devServer === void 0 ? void 0 : _api$config$devServer.port;
        port = yield _utils().portfinder.getPortPromise({
          port: defaultPort
        });
        host = (_ref2 = (_process$env$HOST = process.env.HOST) !== null && _process$env$HOST !== void 0 ? _process$env$HOST : (_api$config$devServer2 = api.config.devServer) === null || _api$config$devServer2 === void 0 ? void 0 : _api$config$devServer2.host) !== null && _ref2 !== void 0 ? _ref2 : '0.0.0.0';

        const _yield$getBundleAndCo = yield (0, _BundleUtils.getBundleAndConfigs)({
          api,
          port
        }),
              bundler = _yield$getBundleAndCo.bundler,
              bundleConfigs = _yield$getBundleAndCo.bundleConfigs,
              bundleImplementor = _yield$getBundleAndCo.bundleImplementor;

        const devServer = yield bundler.setupDevServer({
          port,
          host,
          bundleConfigs,
          bundleImplementor,
          appName: api.pkg.name
        });
        devServer.listen(port, host, err => {
          if (err) {
            return console.log(err);
          }

          (0, _utils().clearConsole)();
          console.log(_utils().chalk.bgBlueBright.black(' SPEED '), _utils().chalk.blueBright(`up the server,Wait a minute...\n`));
        });
      });

      function fn(_x) {
        return _fn.apply(this, arguments);
      }

      return fn;
    }()
  });
  api.registerMethod({
    name: 'getPort',

    fn() {
      (0, _utils().assert)(`api.getPort() is only valid in development.`, api.env === 'development');
      return port;
    }

  });
  api.registerMethod({
    name: 'getHostname',

    fn() {
      (0, _utils().assert)(`api.getHostname() is only valid in development.`, api.env === 'development');
      return host;
    }

  });
  api.registerMethod({
    name: 'restartServer',

    fn() {
      var _process$send, _process;

      (_process$send = (_process = process).send) === null || _process$send === void 0 ? void 0 : _process$send.call(_process, {
        type: 'RESTART'
      });
      console.log(_utils().chalk.gray(`🎯 Try to restart dev server...`));
    }

  });
};

exports.default = _default;