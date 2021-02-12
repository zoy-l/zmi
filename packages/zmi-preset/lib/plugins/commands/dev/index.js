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

function _core() {
  const data = require("@zmi-cli/core");

  _core = function _core() {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getZmiPlugins(pkgPath) {
  let pkg = {};

  if (_fs().default.existsSync(pkgPath)) {
    try {
      pkg = JSON.parse(_fs().default.readFileSync(pkgPath, 'utf-8'));
    } catch (err) {
      throw new Error(err);
    }
  }

  return Object.keys(_objectSpread(_objectSpread({}, pkg.dependencies), pkg.devDependencies)).filter(_core().getPlugin);
}

function watcher(cwd, onChange) {
  const pkgPath = _path().default.join(cwd, 'package.json');

  const plugins = getZmiPlugins(pkgPath);

  const chokidarInstance = _utils().chokidar.watch(pkgPath, {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 500
    }
  });

  chokidarInstance.on('all', () => {
    const usePlugins = getZmiPlugins(pkgPath);
    !_utils().lodash.isEqual(plugins, usePlugins) && onChange();
  });
}

function watchPkg(cwd, onChange) {
  watcher(cwd, onChange);

  if ((0, _utils().winPath)(cwd) !== (0, _utils().winPath)(process.cwd())) {
    watcher(process.cwd(), onChange);
  }
}

var _default = api => {
  function restartServer(desc) {
    (0, _utils().clearConsole)();
    console.log(_utils().chalk.bgGray(' RESTART '), desc);
    console.log();
    api.restartServer();
  }

  api.registerCommand({
    name: 'dev',
    description: 'start dev server for development',

    fn({
      args
    }) {
      return _asyncToGenerator(function* () {
        api.env = 'development';
        process.env.NODE_ENV = 'development';
        const _api$config = api.config,
              miniAppConfig = _api$config.miniAppConfig,
              frameType = _api$config.frameType;
        let FrameType = frameType;

        if (!FrameType) {
          if (miniAppConfig) {
            FrameType = 'miniAppDev';
          } else {
            var _api$pkg;

            const projectConfig = [_fs().default.existsSync(`${api.paths.appSrcPath}/project.config.json`), _fs().default.existsSync(`${api.paths.appSrcPath}/app.json`)].some(Boolean);
            let isWeb = false;

            if ((_api$pkg = api.pkg) !== null && _api$pkg !== void 0 && _api$pkg.dependencies) {
              var _api$pkg2;

              isWeb = Object.keys((_api$pkg2 = api.pkg) === null || _api$pkg2 === void 0 ? void 0 : _api$pkg2.dependencies).some(name => ['react', 'vue'].includes(name));
            }

            if (isWeb && projectConfig) {
              throw new Error(`zmi can't determine it is a 'web/miniapp' environment, please specify 'frameType'`);
            }

            FrameType = projectConfig ? 'miniAppDev' : 'webDev';
          }
        }

        api.service.runCommand({
          command: FrameType,
          args
        });
        const watch = process.env.WATCH !== 'none';

        if (watch) {
          watchPkg(api.cwd, () => {
            restartServer(`Plugins in package.json changed.`);
          });
          const _api$service = api.service,
                configInstance = _api$service.configInstance,
                userConfig = _api$service.userConfig;
          configInstance.watch({
            userConfig,

            onChange({
              pluginChanged,
              valueChanged
            }) {
              return _asyncToGenerator(function* () {
                if (pluginChanged.length) {
                  restartServer(`Plugins of ${pluginChanged.map(p => p.key).join(', ')} changed.`);
                }

                if (valueChanged.length) {
                  let reload = false;
                  const funcs = [];
                  const reloadConfigs = [];
                  valueChanged.forEach(({
                    key,
                    pluginId
                  }) => {
                    var _api$service$plugins$;

                    const _ref = (_api$service$plugins$ = api.service.plugins[pluginId].config) !== null && _api$service$plugins$ !== void 0 ? _api$service$plugins$ : {},
                          onChange = _ref.onChange;

                    if (!onChange || onChange === api.ConfigChangeType.reload) {
                      reload = true;
                      reloadConfigs.push(key);
                    }

                    if (typeof onChange === 'function') {
                      funcs.push(onChange);
                    }
                  });

                  if (reload) {
                    restartServer(`Config ${reloadConfigs.join(', ')} changed.`);
                  } else {
                    api.service.userConfig = configInstance.getUserConfig();
                    const defaultConfig = yield api.applyPlugins({
                      key: 'modifyDefaultConfig',
                      type: api.ApplyPluginsType.modify,
                      initialValue: configInstance.getDefaultConfig()
                    });
                    api.service.config = yield api.applyPlugins({
                      key: 'modifyConfig',
                      type: api.ApplyPluginsType.modify,
                      initialValue: configInstance.getConfig({
                        defaultConfig
                      })
                    });
                    funcs.forEach(fn => fn());
                  }
                }
              })();
            }

          });
        }
      })();
    }

  });
};

exports.default = _default;