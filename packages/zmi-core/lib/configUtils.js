"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeDefault = mergeDefault;
exports.getPlugin = getPlugin;
exports.isEqual = isEqual;

function _utils() {
  const data = require("@zmi-cli/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function mergeDefault({
  defaultConfig,
  config
}) {
  if (_utils().lodash.isPlainObject(defaultConfig) && _utils().lodash.isPlainObject(config)) {
    return (0, _utils().deepmerge)(defaultConfig, config);
  }

  return typeof config !== 'undefined' ? config : defaultConfig;
}

function getPlugin(name) {
  const hasScope = name.charAt(0) === '@';
  const re = /^(@zmi-cli\/|zmi-)plugin-/;
  return hasScope ? re.test(name.split('/')[1]) : re.test(name);
}

function funcToStr(obj) {
  if (typeof obj === 'function') return obj.toString();

  if (_utils().lodash.isPlainObject(obj)) {
    return Object.keys(obj).reduce((memo, key) => {
      memo[key] = funcToStr(obj[key]);
      return memo;
    }, {});
  }

  return obj;
}

function isEqual(a, b) {
  return _utils().lodash.isEqual(funcToStr(a), funcToStr(b));
}