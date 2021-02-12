"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getConfig;

function _reactRefreshWebpackPlugin() {
  const data = _interopRequireDefault(require("@pmmmwh/react-refresh-webpack-plugin"));

  _reactRefreshWebpackPlugin = function _reactRefreshWebpackPlugin() {
    return data;
  };

  return data;
}

function _forkTsCheckerWebpackPlugin() {
  const data = _interopRequireDefault(require("fork-ts-checker-webpack-plugin"));

  _forkTsCheckerWebpackPlugin = function _forkTsCheckerWebpackPlugin() {
    return data;
  };

  return data;
}

function _progressBarWebpackPlugin() {
  const data = _interopRequireDefault(require("progress-bar-webpack-plugin"));

  _progressBarWebpackPlugin = function _progressBarWebpackPlugin() {
    return data;
  };

  return data;
}

function _miniCssExtractPlugin() {
  const data = _interopRequireDefault(require("mini-css-extract-plugin"));

  _miniCssExtractPlugin = function _miniCssExtractPlugin() {
    return data;
  };

  return data;
}

function _htmlWebpackPlugin() {
  const data = _interopRequireDefault(require("html-webpack-plugin"));

  _htmlWebpackPlugin = function _htmlWebpackPlugin() {
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

function _webpackChain() {
  const data = _interopRequireDefault(require("webpack-chain"));

  _webpackChain = function _webpackChain() {
    return data;
  };

  return data;
}

function _webpack() {
  const data = _interopRequireDefault(require("webpack"));

  _webpack = function _webpack() {
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

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function _fs() {
    return data;
  };

  return data;
}

var _getTargetsAndBrowsersList = _interopRequireDefault(require("./getTargetsAndBrowsersList"));

var _VueClientWebpackPlugin = _interopRequireDefault(require("./VueClientWebpackPlugin"));

var _getBabelOptions = require("./getBabelOptions");

var _terserOptions = _interopRequireDefault(require("./terserOptions"));

var _ruleCss = _interopRequireDefault(require("./ruleCss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function getConfig(_x) {
  return _getConfig.apply(this, arguments);
}

function _getConfig() {
  _getConfig = _asyncToGenerator(function* (opts) {
    var _config$outputPath;

    const _opts$bundleImplement = opts.bundleImplementor,
          bundleImplementor = _opts$bundleImplement === void 0 ? _webpack().default : _opts$bundleImplement,
          modifyBabelPresetOpts = opts.modifyBabelPresetOpts,
          modifyBabelOpts = opts.modifyBabelOpts,
          htmlContent = opts.htmlContent,
          _opts$hot = opts.hot,
          hot = _opts$hot === void 0 ? true : _opts$hot,
          config = opts.config,
          entry = opts.entry,
          port = opts.port,
          env = opts.env,
          pkg = opts.pkg,
          cwd = opts.cwd;

    const _getTargetsAndBrowser = (0, _getTargetsAndBrowsersList.default)({
      config
    }),
          targets = _getTargetsAndBrowser.targets,
          browserslist = _getTargetsAndBrowser.browserslist;

    const disableCompress = process.env.COMPRESS === 'none';
    const sourceMap = config.devtool !== 'none';
    const isDev = env === 'development';
    const isProd = env === 'production';
    let isReact = false;
    let isVue = false;

    if (config.frameType) {
      isReact = config.frameType === 'react';
      isVue = config.frameType === 'vue';
    } else {
      const dpsArr = Object.keys(pkg.dependencies);

      for (var _i = 0, _dpsArr = dpsArr; _i < _dpsArr.length; _i++) {
        const dpsName = _dpsArr[_i];

        if (dpsName === 'vue') {
          isVue = true;
          config.frameType = 'vue';
          continue;
        }

        if (dpsName === 'react') {
          config.frameType = 'react';
          isReact = true;
        }
      }

      if (isVue && isReact) {
        throw new Error('When react/vue is found in dependencies, please specify type in .zmirc:`vue` | `react`');
      }

      if (!isVue && !isReact) {
        throw new Error('React/vue is not found in dependencies, did you forget to install dependencies ?');
      }
    }

    const webpackConfig = new (_webpackChain().default)();
    const createCSSRule = (0, _ruleCss.default)({
      webpackConfig,
      browserslist,
      sourceMap,
      config,
      isDev
    }); // @ts-expect-error: library type error

    webpackConfig.devtool(config.devtool);
    webpackConfig.mode(env);

    const appOutputPath = _path().default.join(cwd, (_config$outputPath = config.outputPath) !== null && _config$outputPath !== void 0 ? _config$outputPath : 'dist');

    const useHash = config.hash && isProd ? '[name].[contenthash:8]' : '[name]';
    webpackConfig.when(!!entry, WConfig => {
      Object.keys(entry).forEach(key => {
        const entryPoint = WConfig.entry(key);
        entryPoint.add(entry[key]);
      });
    });
    webpackConfig.output.path(appOutputPath).filename(`${useHash}.js`).chunkFilename(`${useHash}.js`).publicPath(config.publicPath); // To be verified .set('symlinks', true)

    webpackConfig.resolve.modules.add('node_modules').end().extensions.merge(['.web.js', '.wasm', '.mjs', '.js', '.web.jsx', '.jsx', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json']);
    let presetOpts = {
      typescript: !isVue,
      isDev,
      isProd,
      nodeEnv: env,
      dynamicImportNode: config.dynamicImport,
      autoCSSModules: config.autoCSSModules,
      env: {
        targets
      },
      type: config.frameType
    };

    if (modifyBabelPresetOpts) {
      presetOpts = yield modifyBabelPresetOpts(presetOpts);
    }

    let babelOpts = (0, _getBabelOptions.getBabelOpts)({
      config,
      presetOpts,
      hot
    });

    if (modifyBabelOpts) {
      babelOpts = yield modifyBabelOpts(babelOpts);
    }

    webpackConfig.module.rule('js').test(/\.(js|mjs|jsx|ts|tsx)$/).include.add(cwd).end().exclude.add(/node_modules/).end().use('babel-loader').loader(require.resolve('babel-loader')).options(babelOpts);
    webpackConfig.when(!!isVue, WConfig => {
      WConfig.module.rule('vue').test(/\.vue$/).use('vue-loader').loader(require.resolve('vue-loader')).options({
        hotReload: hot
      });
      WConfig.module.rule('vue-ts').test(/\.ts$/).use('ts-loader').loader(require.resolve('ts-loader')).options({
        transpileOnly: true,
        appendTsSuffixTo: ['\\.vue$']
      });
      WConfig.plugin('vue-client').use(_VueClientWebpackPlugin.default);
      WConfig.plugin('vue-loader').use(require('vue-loader').VueLoaderPlugin);
    });
    webpackConfig.module.rule('images').test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/).use('url-loader').loader(require.resolve('url-loader')).options({});
    webpackConfig.module.rule('svg').test(/\.(svg)(\?.*)?$/).use('file-loader').loader(require.resolve('file-loader')).options({
      name: 'static/[name].[hash:8].[ext]',
      esModule: false
    });
    webpackConfig.module.rule('fonts').test(/\.(eot|woff|woff2|ttf)(\?.*)?$/).use('file-loader').loader(require.resolve('file-loader')).options({
      name: 'static/[name].[hash:8].[ext]',
      esModule: false
    });
    webpackConfig.module.rule('plaintext').test(/\.(txt|text|md)$/).use('raw-loader').loader(require.resolve('raw-loader'));
    webpackConfig.when(disableCompress, WConfig => {
      WConfig.optimization.minimize(false);
    }, WConfig => {
      WConfig.optimization.minimizer('terser').use(require.resolve('terser-webpack-plugin'), [{
        terserOptions: (0, _utils().deepmerge)(_terserOptions.default, config.terserOptions),
        extractComments: false,
        parallel: true
      }]);
      WConfig.optimization.minimizer('css-minimizer').use(require.resolve('css-minimizer-webpack-plugin'), [{
        sourceMap
      }]);
    });
    webpackConfig.plugin('define').use(_webpack().default.DefinePlugin, [_objectSpread(_objectSpread({}, config.define), isVue ? {
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false'
    } : {})]); // Turn on react fast refresh
    // Official implementation
    // And also added in cra 4.0
    // https://github.com/pmmmwh/react-refresh-webpack-plugin

    webpackConfig.when(!!isReact && isDev && !!hot, WConfig => {
      WConfig.plugin('hmr').use(_reactRefreshWebpackPlugin().default);
    });
    webpackConfig.when(!isDev, WConfig => {
      WConfig.plugin('extract-css').use(_miniCssExtractPlugin().default, [{
        filename: `${useHash}.css`,
        chunkFilename: `${[useHash]}.chunk.css`
      }]);
    }); // IgnorePlugin ignores localized content when packaging
    // https://www.webpackjs.com/plugins/ignore-plugin/
    // prettier-ignore

    webpackConfig.when(config.ignoreMomentLocale, WConfig => {
      WConfig.plugin('ignore-moment-locale').use(bundleImplementor.IgnorePlugin, [{
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      }]);
    });
    webpackConfig.plugin('HtmlWebpackPlugin').use(_htmlWebpackPlugin().default, [{
      templateContent: htmlContent
    }]);

    if (config.externals) {
      webpackConfig.externals(config.externals);
    }

    if (config.alias) {
      Object.keys(config.alias).forEach(key => {
        webpackConfig.resolve.alias.set(key, config.alias[key]);
      });
    }

    webpackConfig.when(_fs().default.existsSync(`${cwd}/tsconfig.json`), WConfig => {
      WConfig.plugin('ForkTsChecker').use(_forkTsCheckerWebpackPlugin().default, [{
        async: false,
        typescript: isVue ? {
          extensions: {
            vue: {
              enabled: true,
              compiler: '@vue/compiler-sfc'
            }
          },
          diagnosticOptions: {
            semantic: true // https://github.com/TypeStrong/ts-loader#happypackmode
            // syntactic: useThreads

          }
        } : {}
      }]);
    });
    webpackConfig.plugin('ProgressBarPlugin').use(_progressBarWebpackPlugin().default, [{
      total: 15,
      summary: false,
      complete: '▇',
      format: `🚧  ${_utils().chalk.cyan(':bar ')}${_utils().chalk.cyan(':percent')}  ${_utils().chalk.grey('( :elapseds )')}`,
      customSummary: time => {
        console.log(_utils().chalk.blue(`🎯 time ${time} \n`));
      }
    }]);

    if (opts.chainWebpack) {
      yield opts.chainWebpack(webpackConfig, {
        webpack: bundleImplementor,
        createCSSRule
      });
    }

    if (config.chainWebpack) {
      yield config.chainWebpack(webpackConfig, {
        webpack: bundleImplementor,
        createCSSRule,
        env
      });
    }

    const WTarget = webpackConfig.toConfig();
    WTarget.devServer = _utils().deepmerge.all([{
      hot,
      port,
      clientLogLevel: 'silent',
      compress: isProd,
      noInfo: true,
      inline: true,
      stats: 'none',
      contentBase: '/'
    }, config.devServer, {
      before(app, server, compiler) {
        var _config$devServer$bef, _config$devServer;

        // apply in project middlewares
        (_config$devServer$bef = (_config$devServer = config.devServer).before) === null || _config$devServer$bef === void 0 ? void 0 : _config$devServer$bef.call(_config$devServer, app, server, compiler);
      },

      open: false
    }]);
    return WTarget;
  });
  return _getConfig.apply(this, arguments);
}