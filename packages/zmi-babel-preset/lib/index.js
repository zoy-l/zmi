"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toObject = toObject;
exports.default = void 0;

function _utils() {
  const data = require("@zmi-cli/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function toObject(obj) {
  return typeof obj === 'object' ? obj : {};
}

var _default = (_context, options) => {
  const defaultEnvConfig = {
    exclude: ['transform-typeof-symbol', 'transform-unicode-regex', 'transform-sticky-regex', 'transform-new-target', 'transform-modules-umd', 'transform-modules-systemjs', 'transform-modules-amd', 'transform-literals']
  };
  const preset = {
    presets: [options.env && [require.resolve('@babel/preset-env'), _objectSpread(_objectSpread({}, (0, _utils().deepmerge)(defaultEnvConfig, toObject(options.env))), {}, {
      debug: options.debug
    })], options.typescript && [require.resolve('@babel/preset-typescript'), {
      allowNamespaces: true
    }]].filter(Boolean),
    plugins: [[require.resolve('@babel/plugin-proposal-optional-chaining'), {
      loose: false
    }], [require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), {
      loose: false
    }], require.resolve('@babel/plugin-syntax-top-level-await'), [require.resolve('@babel/plugin-transform-destructuring'), {
      loose: false
    }], options.typescript && [require.resolve('babel-plugin-transform-typescript-metadata')], [require.resolve('@babel/plugin-proposal-decorators'), {
      legacy: true
    }], [require.resolve('@babel/plugin-proposal-class-properties'), {
      loose: true
    }], require.resolve('@babel/plugin-proposal-export-default-from'), [require.resolve('@babel/plugin-proposal-pipeline-operator'), {
      proposal: 'minimal'
    }], require.resolve('@babel/plugin-proposal-do-expressions'), require.resolve('@babel/plugin-proposal-function-bind'), require.resolve('@babel/plugin-proposal-logical-assignment-operators'), options.transformRuntime && [require.resolve('@babel/plugin-transform-runtime'), _objectSpread({
      version: require('@babel/runtime/package.json').version,
      absoluteRuntime: _path().default.dirname(require.resolve('@babel/runtime/package.json')),
      useESModules: true
    }, toObject(options.transformRuntime))], options.autoCSSModules && [require.resolve('@zmi-cli/css-modules')], options.dynamicImportNode && [require.resolve('babel-plugin-dynamic-import-node')]].filter(Boolean)
  };
  return options.modify ? options.modify(preset) : preset;
};

exports.default = _default;