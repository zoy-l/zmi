"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBabelOpts = getBabelOpts;

function getBabelOpts({
  config,
  presetOpts,
  hot
}) {
  const type = presetOpts.type,
        isDev = presetOpts.isDev;
  return {
    presets: [[require.resolve('@zmi/babel-preset/app'), presetOpts], ...config.extraBabelPresets].filter(Boolean),
    plugins: [type === 'react' && isDev && hot && require.resolve('react-refresh/babel'), ...config.extraBabelPlugins].filter(Boolean),
    sourceType: 'unambiguous',
    babelrc: false
  };
}