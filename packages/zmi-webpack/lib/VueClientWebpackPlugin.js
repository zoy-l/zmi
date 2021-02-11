"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _webpack() {
  const data = require("webpack");

  _webpack = function _webpack() {
    return data;
  };

  return data;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isSocketEntry(entry) {
  const socketEntries = ['webpack-dev-server/client', 'webpack-hot-middleware/client', 'webpack-plugin-serve/client', 'react-dev-utils/webpackHotDevClient'];
  return socketEntries.some(socketEntry => entry.includes(socketEntry));
}

class VueClient {
  apply(compiler) {
    compiler.options.entry = this.injectRefreshEntry(compiler.options.entry);
    const providePlugin = new (_webpack().ProvidePlugin)({
      __react_refresh_error_overlay__: require.resolve('@pmmmwh/react-refresh-webpack-plugin/overlay'),
      __react_refresh_init_socket__: require.resolve('@pmmmwh/react-refresh-webpack-plugin/sockets/WDSSocket')
    });
    providePlugin.apply(compiler);
  }

  injectRefreshEntry(originalEntry) {
    const overlayEntries = [require.resolve('@pmmmwh/react-refresh-webpack-plugin/client/LegacyWDSSocketEntry'), require.resolve('@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry')];

    if (typeof originalEntry === 'string') {
      if (isSocketEntry(originalEntry)) {
        return [originalEntry, ...overlayEntries];
      }

      return [...overlayEntries, originalEntry];
    }

    if (Array.isArray(originalEntry)) {
      const socketEntryIndex = originalEntry.findIndex(isSocketEntry);
      let socketAndPrecedingEntries = [];

      if (socketEntryIndex !== -1) {
        socketAndPrecedingEntries = originalEntry.splice(0, socketEntryIndex + 1);
      }

      return [...socketAndPrecedingEntries, ...overlayEntries, ...originalEntry];
    }

    if (typeof originalEntry === 'object') {
      return Object.entries(originalEntry).reduce((acc, [curKey, curEntry]) => _objectSpread(_objectSpread({}, acc), {}, {
        [curKey]: typeof curEntry === 'object' && curEntry.import ? _objectSpread(_objectSpread({}, curEntry), {}, {
          import: this.injectRefreshEntry(curEntry.import)
        }) : this.injectRefreshEntry(curEntry)
      }), {});
    }

    if (typeof originalEntry === 'function') {
      return (...args) => Promise.resolve(originalEntry(...args)).then(resolvedEntry => this.injectRefreshEntry(resolvedEntry));
    }

    const _require = require('@pmmmwh/react-refresh-webpack-plugin/lib/utils'),
          createError = _require.createError;

    throw createError('Failed to parse the Webpack `entry` object!');
  }

}

exports.default = VueClient;