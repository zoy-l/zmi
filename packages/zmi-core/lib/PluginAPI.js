"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function utils() {
  const data = _interopRequireWildcard(require("@zmi-cli/utils"));

  utils = function utils() {
    return data;
  };

  return data;
}

var _types = require("./types");

var _Html = _interopRequireDefault(require("./Html"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class PluginAPI {
  constructor(options) {
    this.service = options.service;
    this.id = options.id;
    this.key = options.key;
    this.utils = utils();
    this.Html = _Html.default;
  }

  describe({
    id,
    key,
    config,
    enableBy
  } = {}) {
    const plugins = this.service.plugins; // this.id and this.key is generated automatically
    // so we need to diff first

    if (id && this.id !== id) {
      plugins[id] && utils().assert(`api.describe() failed, plugin ${id} is already registered by ${plugins[id].path}.`); // overwrite the old describe

      plugins[id] = plugins[this.id];
      plugins[id].id = id;
      delete plugins[this.id];
      this.id = id;
    }

    if (key && this.key !== key) {
      this.key = key;
      plugins[this.id].key = key;
    }

    if (config) {
      plugins[this.id].config = config;
    }

    plugins[this.id].enableBy = enableBy !== null && enableBy !== void 0 ? enableBy : _types.EnumEnableBy.register;
  }

  registerCommand(command) {
    const name = command.name,
          alias = command.alias;
    utils().assert(`api.registerCommand() failed, the command ${name} is exists.`, !this.service.commands[name]);
    this.service.commands[name] = command;

    if (alias) {
      this.service.commands[alias] = name;
    }
  }

  registerMethod(options) {
    const fn = options.fn,
          name = options.name,
          exitsError = options.exitsError;
    const pluginMethods = this.service.pluginMethods;

    if (!pluginMethods[name]) {
      pluginMethods[name] = fn !== null && fn !== void 0 ? fn : function (Fn) {
        const hook = {
          key: name,
          fn: Fn
        };
        this.register(hook);
      };
      return;
    }

    if (exitsError) {
      utils().assert(`api.registerMethod() failed, method ${name} is already exist.`);
    }
  }

  register(hook) {
    var _hooksByPluginId$this;

    utils().assert(`api.register() failed, hook.key must supplied and should be string, but got ${hook.key}.`, hook.key && typeof hook.key === 'string');
    utils().assert(`api.register() failed, hook.fn must supplied and should be function, but got ${hook.fn}.`, typeof hook.fn === 'function');
    const hooksByPluginId = this.service.hooksByPluginId;
    hooksByPluginId[this.id] = ((_hooksByPluginId$this = hooksByPluginId[this.id]) !== null && _hooksByPluginId$this !== void 0 ? _hooksByPluginId$this : []).concat(hook);
  }

  skipPlugins(pluginIds) {
    pluginIds.forEach(pluginId => {
      this.service.skipPluginIds.add(pluginId);
    });
  }

}

exports.default = PluginAPI;