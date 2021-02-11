"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BundleUtils = require("../../common/BundleUtils");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = api => {
  api.registerCommand({
    name: 'build',
    description: 'build application production',

    fn() {
      return _asyncToGenerator(function* () {
        api.env = 'production';
        process.env.NODE_ENV = 'production';

        const _yield$getBundleAndCo = yield (0, _BundleUtils.getBundleAndConfigs)({
          api
        }),
              bundler = _yield$getBundleAndCo.bundler,
              bundleConfigs = _yield$getBundleAndCo.bundleConfigs,
              bundleImplementor = _yield$getBundleAndCo.bundleImplementor;

        try {
          const appOutputPath = api.paths.appOutputPath;
          const stats = yield bundler.build({
            bundleConfigs,
            bundleImplementor,
            appOutputPath
          });
          yield api.applyPlugins({
            key: 'onBuildComplete',
            type: api.ApplyPluginsType.event,
            args: {
              stats
            }
          });
        } catch (err) {
          yield api.applyPlugins({
            key: 'onBuildComplete',
            type: api.ApplyPluginsType.event,
            args: {
              err
            }
          });
        }
      })();
    }

  });
};

exports.default = _default;