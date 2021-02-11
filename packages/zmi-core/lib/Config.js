"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _utils() {
  const data = require("@zmi/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _joi() {
  const data = _interopRequireDefault(require("joi"));

  _joi = function _joi() {
    return data;
  };

  return data;
}

var _configUtils = require("./configUtils");

var _types = require("./types");

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

const possibleConfigPaths = [process.env.LIM_CONFIG_PATH, '.zmirc.ts', '.zmirc.js'].filter(Boolean);

class Config {
  constructor(options) {
    var _options$cwd;

    this.cwd = (_options$cwd = options.cwd) !== null && _options$cwd !== void 0 ? _options$cwd : process.cwd();
    this.service = options.service;
  }

  getDefaultConfig() {
    const plugins = this.service.plugins;
    const pluginIds = Object.keys(plugins); // collect default config

    return pluginIds.reduce((memo, pluginId) => {
      const _plugins$pluginId = plugins[pluginId],
            key = _plugins$pluginId.key,
            _plugins$pluginId$con = _plugins$pluginId.config,
            config = _plugins$pluginId$con === void 0 ? {} : _plugins$pluginId$con;
      if ('default' in config) memo[key] = config.default;
      return memo;
    }, {});
  }

  getConfig(defaultConfig) {
    const _this$service = this.service,
          stage = _this$service.stage,
          plugins = _this$service.plugins;
    const userConfig = this.getUserConfig();
    (0, _utils().assert)(`Config.getConfig() failed, it should not be executed before plugin is ready.`, stage >= _types.ServiceStage.pluginReady);
    const userConfigKeys = Object.keys(userConfig).filter(key => userConfig[key] !== false);
    const keepKeys = {}; // get config

    Object.keys(plugins).forEach(pluginId => {
      const _plugins$pluginId2 = plugins[pluginId],
            key = _plugins$pluginId2.key,
            _plugins$pluginId2$co = _plugins$pluginId2.config,
            config = _plugins$pluginId2$co === void 0 ? {} : _plugins$pluginId2$co;
      const value = userConfig[key];

      if (!keepKeys[key]) {
        keepKeys[key] = key;
      } else {
        throw new Error(`have multiple same ${key}`);
      } // recognize as key if have `schema` config
      // disabled when `value` is false


      if (!config.schema || value === false) return;
      const schema = config.schema(_joi().default);
      (0, _utils().assert)(`schema return from plugin ${pluginId} is not valid schema.`, _joi().default.isSchema(schema));

      const _schema$validate = schema.validate(value),
            error = _schema$validate.error;

      error && (0, _utils().assert)(`Validate config "${key}" failed, ${error.message}`);
      const index = userConfigKeys.indexOf(key.split('.')[0]);

      if (index !== -1) {
        userConfigKeys.splice(index, 1);
      } // update userConfig with defaultConfig


      if (key in defaultConfig) {
        const newValue = (0, _configUtils.mergeDefault)({
          defaultConfig: defaultConfig[key],
          config: value
        });
        userConfig[key] = newValue;
      }
    });

    if (userConfigKeys.length) {
      const keys = userConfigKeys.length > 1 ? 'keys' : 'key';
      (0, _utils().assert)(`Invalid config ${keys}: ${userConfigKeys.join(', ')}`);
    }

    return userConfig;
  }

  getConfigFile() {
    const configFile = possibleConfigPaths.find(file => _fs().default.existsSync(_path().default.join(this.cwd, file)));
    return configFile ? (0, _utils().winPath)(configFile) : undefined;
  }

  getUserConfig() {
    const configFile = this.getConfigFile();
    this.configFile = configFile;
    let envConfigFile;

    if (process.env.ZMI_ENV) {
      var _getFile;

      // environment variable config file `.env.ZMI_ENV` and remove ext
      // Because it is synthesized according to the base file
      // local may be `(j|t)s` file
      // If there is no configFile, the default is `.zmirc`
      // Set here to `.ts` it has no practical effect, just a placeholder
      const envConfigFileName = this.addAffix(configFile !== null && configFile !== void 0 ? configFile : '.zmirc.ts', process.env.ZMI_ENV, !!configFile); // 👆 follow the above, or the real local environment config file

      envConfigFile = (_getFile = (0, _utils().getFile)({
        fileNameWithoutExt: envConfigFileName,
        type: 'javascript',
        base: this.cwd
      })) === null || _getFile === void 0 ? void 0 : _getFile.filename;
      !envConfigFile && (0, _utils().assert)([`get user config failed, ${envConfigFile} does not exist, `, `but process.env.ZMI_ENV is set to ${process.env.ZMI_ENV}.`]);
    } // check the authenticity of documents


    const files = [configFile, envConfigFile].map(file => {
      if (file) {
        const real = _path().default.join(this.cwd, file);

        return _fs().default.existsSync(real) && real;
      }

      return false;
    }).filter(Boolean);

    if (files.length) {
      // handling circular references
      // clear require cache
      const requireDeps = files.reduce((memo, file) => memo.concat((0, _utils().parseRequireDeps)(file)), []);
      requireDeps.forEach(_utils().clearModule); // Just-in-time compilation at runtime

      this.service.babelRegister.setOnlyMap({
        key: 'config',
        value: requireDeps
      });
      return this.mergeConfig([...files]);
    }

    return {};
  }

  addAffix(file, affix, isExt = true) {
    const ext = _path().default.extname(file);

    return file.replace(new RegExp(`${ext}$`), `.${affix}${isExt ? ext : ''}`);
  }

  requireConfigs(configFiles) {
    return configFiles && configFiles.map(file => (0, _utils().compatibleWithESModule)(require(file)));
  }

  mergeConfig(configs) {
    let newConfig = {}; // TODO: Refined processing, such as processing dotted config key

    this.requireConfigs(configs).forEach(config => {
      newConfig = (0, _utils().deepmerge)(newConfig, config);
    });
    return newConfig;
  }

  getWatchFilesAndDirectories() {
    const umiEnv = process.env.UMI_ENV;

    const configFiles = _utils().lodash.clone(possibleConfigPaths);

    possibleConfigPaths.forEach(f => {
      // if (this.localConfig) configFiles.push(this.addAffix(f, 'local'))
      if (umiEnv) configFiles.push(this.addAffix(f, umiEnv));
    });
    const configDir = (0, _utils().winPath)(_path().default.join(this.cwd, 'config'));
    const files = configFiles.reduce((memo, f) => {
      const file = (0, _utils().winPath)(_path().default.join(this.cwd, f));

      if (_fs().default.existsSync(file)) {
        memo = memo.concat((0, _utils().parseRequireDeps)(file));
      } else {
        memo.push(file);
      }

      return memo;
    }, []).filter(f => !f.startsWith(configDir));
    return [configDir].concat(files);
  }

  watch(opts) {
    let paths = this.getWatchFilesAndDirectories();
    let userConfig = opts.userConfig;

    const watcher = _utils().chokidar.watch(paths, {
      ignoreInitial: true,
      cwd: this.cwd,
      awaitWriteFinish: {
        stabilityThreshold: 500
      }
    });

    watcher.on('all', (event, path) => {
      console.log(_utils().chalk.gray(`[${event}]:`), path);
      const newPaths = this.getWatchFilesAndDirectories();

      const diffs = _utils().lodash.difference(newPaths, paths);

      if (diffs.length) {
        watcher.add(diffs);
        paths = paths.concat(diffs);
      }

      const newUserConfig = this.getUserConfig();
      const pluginChanged = [];
      const valueChanged = [];
      Object.keys(this.service.plugins).forEach(pluginId => {
        const _this$service$plugins = this.service.plugins[pluginId],
              key = _this$service$plugins.key,
              _this$service$plugins2 = _this$service$plugins.config,
              config = _this$service$plugins2 === void 0 ? {} : _this$service$plugins2; // recognize as key if have schema config

        if (!(0, _configUtils.isEqual)(newUserConfig[key], userConfig[key]) && config.schema) {
          if (newUserConfig[key] === false || userConfig[key] === false) {
            pluginChanged.push({
              key,
              pluginId
            });
          } else {
            valueChanged.push({
              key,
              pluginId
            });
          }
        }
      });

      if (pluginChanged.length || valueChanged.length) {
        opts.onChange({
          userConfig: newUserConfig,
          pluginChanged,
          valueChanged
        });
      }

      userConfig = newUserConfig;
    });
  }

}

exports.default = Config;