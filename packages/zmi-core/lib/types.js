"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigChangeType = exports.EnumEnableBy = exports.EnumApplyPlugins = exports.ServiceStage = void 0;
var ServiceStage;
exports.ServiceStage = ServiceStage;

(function (ServiceStage) {
  ServiceStage[ServiceStage["uninitialized"] = 0] = "uninitialized";
  ServiceStage[ServiceStage["init"] = 1] = "init";
  ServiceStage[ServiceStage["initPlugins"] = 2] = "initPlugins";
  ServiceStage[ServiceStage["initHooks"] = 3] = "initHooks";
  ServiceStage[ServiceStage["pluginReady"] = 4] = "pluginReady";
  ServiceStage[ServiceStage["getConfig"] = 5] = "getConfig";
  ServiceStage[ServiceStage["getPaths"] = 6] = "getPaths";
  ServiceStage[ServiceStage["run"] = 7] = "run";
})(ServiceStage || (exports.ServiceStage = ServiceStage = {}));

var EnumApplyPlugins;
exports.EnumApplyPlugins = EnumApplyPlugins;

(function (EnumApplyPlugins) {
  EnumApplyPlugins["add"] = "add";
  EnumApplyPlugins["modify"] = "modify";
  EnumApplyPlugins["event"] = "event";
})(EnumApplyPlugins || (exports.EnumApplyPlugins = EnumApplyPlugins = {}));

var EnumEnableBy;
exports.EnumEnableBy = EnumEnableBy;

(function (EnumEnableBy) {
  EnumEnableBy["register"] = "register";
  EnumEnableBy["config"] = "config";
})(EnumEnableBy || (exports.EnumEnableBy = EnumEnableBy = {}));

var ConfigChangeType;
exports.ConfigChangeType = ConfigChangeType;

(function (ConfigChangeType) {
  ConfigChangeType["reload"] = "reload";
})(ConfigChangeType || (exports.ConfigChangeType = ConfigChangeType = {}));