"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _miniCssExtractPlugin() {
  const data = _interopRequireDefault(require("mini-css-extract-plugin"));

  _miniCssExtractPlugin = function _miniCssExtractPlugin() {
    return data;
  };

  return data;
}

function _utils() {
  const data = require("@zmi-cli/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = options => {
  const webpackConfig = options.webpackConfig,
        isDev = options.isDev,
        config = options.config,
        browserslist = options.browserslist,
        sourceMap = options.sourceMap;

  function createCSSRule(createCSSRuleOptions) {
    const lang = createCSSRuleOptions.lang,
          test = createCSSRuleOptions.test,
          loader = createCSSRuleOptions.loader;
    const baseRule = webpackConfig.module.rule(lang).test(test);
    const modulesRule = baseRule.oneOf('normal-modules').resourceQuery(/module/);
    applyLoaders(modulesRule, true);
    const normalRule = baseRule.oneOf('normal');
    applyLoaders(normalRule, false);

    function applyLoaders(rule, isCSSModules) {
      var _config$cssLoader, _config$autoprefixer, _config$extraPostCSSP;

      rule.when(isDev, WConfig => {
        var _config$styleLoader;

        WConfig.use('style-loader').loader(require.resolve('style-loader')).options((0, _utils().deepmerge)({
          base: 0
        }, (_config$styleLoader = config.styleLoader) !== null && _config$styleLoader !== void 0 ? _config$styleLoader : {}));
      }, WConfig => {
        WConfig.use('extract-css-loader').loader(_miniCssExtractPlugin().default.loader).options({
          publicPath: './',
          esModule: !isDev
        });
      });
      rule.when(isDev && isCSSModules && config.cssModulesTypescript, WConfig => {
        WConfig.use('css-modules-typescript-loader').loader(require.resolve('css-modules-typescript-loader')).options(config.cssModulesTypescript);
      }); // prettier-ignore

      const cssLoaderOptions = (0, _utils().deepmerge)({
        importLoaders: 1,
        modules: {},
        sourceMap
      }, (_config$cssLoader = config.cssLoader) !== null && _config$cssLoader !== void 0 ? _config$cssLoader : {});

      if (isCSSModules) {
        cssLoaderOptions.modules = _objectSpread({
          localIdentName: '[local]___[hash:base64:5]'
        }, cssLoaderOptions.modules);
      } else {
        delete cssLoaderOptions.modules;
      } // prettier-ignore


      rule.use('css-loader').loader(require.resolve('css-loader')).options(cssLoaderOptions); // prettier-ignore

      rule.use('postcss').loader(require.resolve('postcss-loader')).options({
        postcssOptions: {
          sourceMap,
          plugins: [require.resolve('postcss-flexbugs-fixes'), [require.resolve('postcss-preset-env'), {
            autoprefixer: _objectSpread(_objectSpread({}, (_config$autoprefixer = config.autoprefixer) !== null && _config$autoprefixer !== void 0 ? _config$autoprefixer : {}), {}, {
              overrideBrowserslist: browserslist !== null && browserslist !== void 0 ? browserslist : {}
            }),
            stage: 3
          }], ...((_config$extraPostCSSP = config.extraPostCSSPlugins) !== null && _config$extraPostCSSP !== void 0 ? _config$extraPostCSSP : [])].filter(Boolean)
        }
      });
      rule.when(!!loader, WConfig => {
        var _createCSSRuleOptions;

        WConfig.use(loader).loader(loader).options((_createCSSRuleOptions = createCSSRuleOptions.options) !== null && _createCSSRuleOptions !== void 0 ? _createCSSRuleOptions : {});
      });
    }
  }

  const _config$loaderOptions = config.loaderOptions,
        less = _config$loaderOptions.less,
        scss = _config$loaderOptions.scss,
        stylus = _config$loaderOptions.stylus;
  createCSSRule({
    lang: 'css',
    test: /\.(css)(\?.*)?$/
  });
  createCSSRule({
    lang: 'scss',
    test: /\.scss$/,
    loader: 'sass-loader',
    options: (0, _utils().deepmerge)({
      sourceMap
    }, scss)
  });
  createCSSRule({
    lang: 'less',
    test: /\.less$/,
    loader: require.resolve('less-loader'),
    options: (0, _utils().deepmerge)({
      sourceMap
    }, less)
  });
  createCSSRule({
    lang: 'stylus',
    test: /\.styl(us)?$/,
    loader: 'stylus-loader',
    options: (0, _utils().deepmerge)({
      sourceMap
    }, stylus)
  });
  return createCSSRule;
};

exports.default = _default;