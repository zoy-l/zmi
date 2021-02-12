"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _utils() {
  const data = require("@zmi-cli/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _tapable() {
  const data = require("tapable");

  _tapable = function _tapable() {
    return data;
  };

  return data;
}

function _events() {
  const data = require("events");

  _events = function _events() {
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

var _pluginUtils = require("./pluginUtils");

var _PluginAPI = _interopRequireDefault(require("./PluginAPI"));

var _withEnv = _interopRequireDefault(require("./withEnv"));

var _Config = _interopRequireDefault(require("./Config"));

var _paths = _interopRequireDefault(require("./paths"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const Cycle = ['onPluginReady', 'modifyPaths', 'onStart', 'modifyDefaultConfig', 'modifyConfig'];
const ServiceAttribute = ['ApplyPluginsType', 'babelRegister', 'applyPlugins', 'ServiceStage', 'userConfig', 'hasPlugins', 'EnableBy', 'config', 'paths', 'stage', 'args', 'env', 'cwd', 'pkg'];

class Service extends _events().EventEmitter {
  constructor(opts) {
    var _opts$cwd, _opts$pkg, _opts$env, _opts$plugins, _this$userConfig$plug;

    super();
    /**
     * @desc Plug-in to be registered
     */

    this.extraPlugins = [];
    /**
     * @desc initial Plugins
     */

    this.initialPlugins = [];
    /**
     * @desc registered commands
     */

    this.commands = {};
    /**
     * @desc plugin Methods
     */

    this.pluginMethods = {};
    /**
     * @desc plugin set
     */

    this.plugins = {};
    /**
     * @desc hooks
     */

    this.hooks = {};
    /**
     * @desc { Record<string, IHook[]> }
     */

    this.hooksByPluginId = {};
    /**
     * @desc The id of the plugin that does not need to be loaded
     */

    this.skipPluginIds = new Set();
    /**
     * @desc How to enable the plug-in, the default is to register and enable
     */

    this.EnableBy = _types.EnumEnableBy;
    /**
     * @desc Apply Plugin enumeration value, provide a plug-in use
     */

    this.ApplyPluginsType = _types.EnumApplyPlugins;
    /**
     * @desc lifecycle stage
     */

    this.stage = _types.ServiceStage.uninitialized;
    /**
     * @desc enum lifecycle
     */

    this.ServiceStage = _types.ServiceStage;
    /**
     * @desc dev onChange type
     */

    this.ConfigChangeType = _types.ConfigChangeType;
    this.cwd = (_opts$cwd = opts.cwd) !== null && _opts$cwd !== void 0 ? _opts$cwd : process.cwd();
    this.pkg = (_opts$pkg = opts.pkg) !== null && _opts$pkg !== void 0 ? _opts$pkg : this.resolvePackage();
    this.env = (_opts$env = opts.env) !== null && _opts$env !== void 0 ? _opts$env : process.env.NODE_ENV;
    this.babelRegister = new (_utils().BabelRegister)(); // Load environment variables from .env file into process.env

    this.loadEnv();
    this.configInstance = new _Config.default({
      cwd: this.cwd,
      service: this
    });
    this.userConfig = this.configInstance.getUserConfig(); // Get the path of the app and expose it to the outside

    this.paths = (0, _paths.default)({
      config: this.userConfig,
      cwd: this.cwd,
      env: this.env
    });
    this.initialPlugins = (0, _pluginUtils.resolvePlugins)({
      cwd: this.cwd,
      pkg: this.pkg,
      plugins: (_opts$plugins = opts.plugins) !== null && _opts$plugins !== void 0 ? _opts$plugins : [],
      userConfigPlugins: (_this$userConfig$plug = this.userConfig.plugins) !== null && _this$userConfig$plug !== void 0 ? _this$userConfig$plug : []
    });
    this.babelRegister.setOnlyMap({
      key: 'initialPlugins',
      value: _utils().lodash.uniq(this.initialPlugins.map(({
        path
      }) => path))
    });
  }

  setStage(stage) {
    this.stage = stage;
  }

  init() {
    var _this = this;

    return _asyncToGenerator(function* () {
      var _this$config;

      _this.setStage(_types.ServiceStage.init);

      _this.extraPlugins = _utils().lodash.cloneDeep(_this.initialPlugins);

      _this.setStage(_types.ServiceStage.initPlugins);

      while (_this.extraPlugins.length) {
        // An error will be reported here because `ESlint` prohibits all circular use of `await`
        // It is safe to use `await` in a loop without callback
        // eslint-disable-next-line no-await-in-loop
        yield _this.initPlugins(_this.extraPlugins.shift());
      }

      _this.setStage(_types.ServiceStage.initHooks);

      Object.keys(_this.hooksByPluginId).forEach(id => {
        const hooks = _this.hooksByPluginId[id];
        hooks.forEach(hook => {
          var _this$hooks$key;

          const key = hook.key;
          hook.pluginId = id;
          _this.hooks[key] = ((_this$hooks$key = _this.hooks[key]) !== null && _this$hooks$key !== void 0 ? _this$hooks$key : []).concat(hook);
        });
      });

      _this.setStage(_types.ServiceStage.pluginReady);

      yield _this.applyPlugins({
        key: 'onPluginReady',
        type: _this.ApplyPluginsType.event
      }); // get config, including:
      // 1. merge default config
      // 2. validate

      _this.setStage(_types.ServiceStage.getConfig);

      const defaultConfig = yield _this.applyPlugins({
        key: 'modifyDefaultConfig',
        type: _this.ApplyPluginsType.modify,
        initialValue: _this.configInstance.getDefaultConfig()
      });
      _this.config = yield _this.applyPlugins({
        key: 'modifyConfig',
        type: _this.ApplyPluginsType.modify,
        initialValue: _this.configInstance.getConfig(defaultConfig)
      });

      _this.setStage(_types.ServiceStage.getPaths); // config.outputPath may be modified by plugins


      if ((_this$config = _this.config) !== null && _this$config !== void 0 && _this$config.outputPath) {
        _this.paths.appOutputPath = _path().default.join(_this.cwd, _this.config.outputPath);
      }

      const paths = yield _this.applyPlugins({
        key: 'modifyPaths',
        type: _this.ApplyPluginsType.modify,
        initialValue: _this.paths
      });
      Object.keys(paths).forEach(key => {
        _this.paths[key] = paths[key];
      });
    })();
  }

  initPlugins(plugin) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const id = plugin.id,
            key = plugin.key,
            apply = plugin.apply;

      const api = _this2.getPluginAPI({
        id,
        key,
        service: _this2
      }); // Plugin is cached here for checking


      _this2.plugins[plugin.id] = plugin; // Plugin or Plugins
      // Execute plugin method and pass in api.any
      // There are two situations here
      // 1. Import the plug-in collection, then return a string[]
      // 2. Execute plug-in method and pass in api
      // there is an extra, no `require` is used, but `import` is used
      // and ʻimport` is a Promise, so `await` is needed here

      const plugins = yield apply()(api); // If it is an Array
      // It represents a collection of plugins added to the top of extraPlugins
      // Path verification pathToRegister has been done
      // `Reverse` to ensure the order of plugins

      if (Array.isArray(plugins)) {
        plugins.reverse().forEach(path => {
          _this2.extraPlugins.unshift((0, _pluginUtils.pathToRegister)({
            path,
            cwd: _this2.cwd
          }));
        }); // The collection may contain the same plugin
        // So here is a de-duplication process

        _this2.extraPlugins = _utils().lodash.uniq(_this2.extraPlugins);
      }
    })();
  }

  getPluginAPI(opts) {
    const pluginAPI = new _PluginAPI.default(opts); // life cycle

    Cycle.forEach(name => {
      pluginAPI.registerMethod({
        name,
        exitsError: false
      });
    });
    return new Proxy(pluginAPI, {
      get: (target, prop) => {
        var _this$pluginMethods$p;

        return (// The plugin Method has the highest weight, followed by Service, and finally plugin API
          // Because pluginMethods needs to be available in the register phase
          // The latest update must be dynamically obtained through proxy to achieve the effect of registering and using
          (_this$pluginMethods$p = this.pluginMethods[prop]) !== null && _this$pluginMethods$p !== void 0 ? _this$pluginMethods$p : ServiceAttribute.includes(prop) ? typeof this[prop] === 'function' ? this[prop].bind(this) : this[prop] : target[prop]
        );
      }
    });
  }

  applyPlugins(pluginOptions) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      var _this3$hooks$key;

      const _this3$ApplyPluginsTy = _this3.ApplyPluginsType,
            add = _this3$ApplyPluginsTy.add,
            modify = _this3$ApplyPluginsTy.modify,
            event = _this3$ApplyPluginsTy.event;
      const key = pluginOptions.key,
            type = pluginOptions.type,
            args = pluginOptions.args,
            initialValue = pluginOptions.initialValue;
      const hookArgs = {
        [add]: initialValue !== null && initialValue !== void 0 ? initialValue : [],
        [modify]: initialValue,
        [event]: null
      };
      const typeIndex = Object.keys(hookArgs).indexOf(type);
      const hooks = (_this3$hooks$key = _this3.hooks[key]) !== null && _this3$hooks$key !== void 0 ? _this3$hooks$key : []; // tapable: https://github.com/webpack/tapable

      const TypeSeriesWater = new (_tapable().AsyncSeriesWaterfallHook)([typeIndex !== 2 ? 'memo' : '_']); // Add hook method into the actuator
      // Prepare for later
      // prettier-ignore

      const TypeSeriesWaterApply = func => {
        hooks.forEach(hook => {
          if (_this3.isPluginEnable(hook.pluginId)) {
            var _hook$pluginId, _hook$stage;

            TypeSeriesWater.tapPromise({
              name: (_hook$pluginId = hook.pluginId) !== null && _hook$pluginId !== void 0 ? _hook$pluginId : `$${hook.key}`,
              stage: (_hook$stage = hook.stage) !== null && _hook$stage !== void 0 ? _hook$stage : 0,
              before: hook.before
            }, func(hook));
          }
        });
      }; // `add` requires return values, these return values will eventually be combined into an array
      // `modify`, need to modify the first parameter and return
      // `event`, no return value


      switch (type) {
        case add:
          TypeSeriesWaterApply(hook => /*#__PURE__*/function () {
            var _ref = _asyncToGenerator(function* (memo) {
              const items = yield hook.fn(args);
              return memo.concat(items);
            });

            return function (_x) {
              return _ref.apply(this, arguments);
            };
          }());
          break;

        case modify:
          TypeSeriesWaterApply(hook => /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(function* (memo) {
              return hook.fn(memo, args);
            });

            return function (_x2) {
              return _ref2.apply(this, arguments);
            };
          }());
          break;

        case event:
          TypeSeriesWaterApply(hook => /*#__PURE__*/_asyncToGenerator(function* () {
            yield hook.fn(args);
          }));
          break;

        default:
          (0, _utils().assert)(`applyPlugin failed, type is not defined or is not matched, got "${type}".`);
      }

      return TypeSeriesWater.promise(hookArgs[type]);
    })();
  }

  isPluginEnable(pluginId) {
    const _this$plugins$pluginI = this.plugins[pluginId],
          key = _this$plugins$pluginI.key,
          enableBy = _this$plugins$pluginI.enableBy;
    const skipStep = [this.skipPluginIds.has(pluginId), this.userConfig[key] === false, this.EnableBy.config === enableBy && !(key in this.userConfig)]; // judgment in order
    // the array order is fixed, the priority is the same as the array order

    while (skipStep.length) {
      if (skipStep.shift()) return false;
    }

    return typeof enableBy !== 'function' || enableBy();
  }

  loadEnv() {
    const basePath = _path().default.join(this.cwd, '.env');

    const localPath = `${basePath}.local`;
    (0, _withEnv.default)(basePath);
    (0, _withEnv.default)(localPath);
  }

  hasPlugins(pluginIds) {
    // exposed to the outside for inspection
    return pluginIds.every(pluginId => this.plugins[pluginId] && this.isPluginEnable(pluginId));
  }

  resolvePackage() {
    try {
      return require(_path().default.join(this.cwd, 'package.json'));
    } catch (err) {
      return {};
    }
  }

  run({
    args,
    command
  }) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      yield _this4.init();

      _this4.setStage(_types.ServiceStage.run);

      yield _this4.applyPlugins({
        key: 'onStart',
        type: _this4.ApplyPluginsType.event,
        args: {
          args
        }
      });

      _this4.runCommand({
        command,
        args
      });
    })();
  }

  runCommand({
    command,
    args
  }) {
    // If type alias is set
    // Need to find the actual command
    const event = typeof this.commands[command] === 'string' ? this.commands[this.commands[command]] : this.commands[command];
    (0, _utils().assert)(`run command failed, command "${command}" does not exists.`, event);
    const fn = event.fn;
    fn({
      args
    });
  }

}

exports.default = Service;