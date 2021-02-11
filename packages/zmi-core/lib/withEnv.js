"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadDotEnv;

function _dotenv() {
  const data = require("dotenv");

  _dotenv = function _dotenv() {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadDotEnv(envPath) {
  // If the path exists
  // Compare one by one, the existing value will not be overwritten
  if (_fs().default.existsSync(envPath)) {
    var _parse;

    const parsed = (_parse = (0, _dotenv().parse)(_fs().default.readFileSync(envPath, 'utf-8'))) !== null && _parse !== void 0 ? _parse : {};
    Object.keys(parsed).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key];
      }
    });
  }
}