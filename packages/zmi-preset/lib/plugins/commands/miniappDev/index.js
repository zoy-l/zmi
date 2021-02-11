"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _zmiNerd() {
  const data = _interopRequireDefault(require("zmi-nerd"));

  _zmiNerd = function _zmiNerd() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = api => {
  api.registerCommand({
    name: 'miniAppDev',
    description: 'start miniApp dev server for development',

    fn() {
      return _asyncToGenerator(function* () {
        var _api$config$miniAppCo;

        const nerd = new (_zmiNerd().default)({
          customPrefix: 'miniApp',
          watch: true,
          userConfig: (_api$config$miniAppCo = api.config.miniAppConfig) !== null && _api$config$miniAppCo !== void 0 ? _api$config$miniAppCo : {}
        });
        yield nerd.step();
      })();
    }

  });
};

exports.default = _default;