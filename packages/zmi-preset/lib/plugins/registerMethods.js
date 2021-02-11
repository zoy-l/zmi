"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(api) {
  const presetApiMethods = ['onExit', 'onBuildComplete', 'onDevCompileDone', 'chainWebpack', 'addHTMLMetas', 'addHTMLLinks', 'addHTMLStyles', 'addHTMLHeadScripts', 'addHTMLScripts'];
  presetApiMethods.forEach(name => {
    api.registerMethod({
      name
    });
  });
}