"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _utils() {
  const data = require("@zmi/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _default({
  config
}) {
  var _config$targets, _targets$browsers;

  let targets = (0, _utils().deepmerge)({
    chrome: 49,
    firefox: 64,
    safari: 10,
    edge: 13,
    ios: 10
  }, (_config$targets = config.targets) !== null && _config$targets !== void 0 ? _config$targets : {}); // filter false and 0 targets

  targets = Object.keys(targets).filter(key => {
    if (targets[key] === false) return false;
    return key !== 'node';
  }).reduce((memo, key) => {
    memo[key] = targets[key];
    return memo;
  }, {});
  const browserslist = (_targets$browsers = targets.browsers) !== null && _targets$browsers !== void 0 ? _targets$browsers : Object.keys(targets).map(key => `${key} >= ${targets[key] === true ? '0' : targets[key]}`);
  return {
    targets,
    browserslist
  };
}