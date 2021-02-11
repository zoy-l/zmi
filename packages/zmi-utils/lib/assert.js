"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assert;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function _chalk() {
    return data;
  };

  return data;
}

var _clearConsole = _interopRequireDefault(require("./clearConsole"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function assert(desc, value = false) {
  if (!value) {
    (0, _clearConsole.default)();
    console.error(_chalk().default.red(`✖ ERROR: ${Array.isArray(desc) ? desc.join('') : desc}\n`));
    process.exit(0);
  }
}