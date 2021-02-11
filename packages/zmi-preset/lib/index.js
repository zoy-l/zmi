"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

var _default = () => {
  const plugins = _path().default.join(__dirname, './plugins');

  const commandsPath = _fs().default.readdirSync(`${plugins}/commands`).map(f => `commands/${f}`);

  const featuresPath = _fs().default.readdirSync(`${plugins}/features`).map(f => `features/${f}`).filter(file => file.endsWith('.js'));

  return ['registerMethods', ...commandsPath, ...featuresPath].map(file => require.resolve(`${plugins}/${file}`));
};

exports.default = _default;