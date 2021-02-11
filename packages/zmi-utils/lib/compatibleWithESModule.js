"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compatESModuleRequire;

function compatESModuleRequire(m) {
  return m.__esModule ? m.default : m;
}