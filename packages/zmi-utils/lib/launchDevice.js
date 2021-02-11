"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.defaultYargsOptions = void 0;

function _yargsParser() {
  const data = _interopRequireDefault(require("yargs-parser"));

  _yargsParser = function _yargsParser() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultYargsOptions = {
  alias: {
    version: ['v'],
    help: ['h']
  },
  boolean: ['version']
};
exports.defaultYargsOptions = defaultYargsOptions;

var _default = opts => new Promise((resolve, reject) => {
  try {
    const args = (0, _yargsParser().default)(process.argv.slice(2), opts);
    resolve({
      args,
      command: args._[0]
    });
  } catch (err) {
    reject(err);
  }
});

exports.default = _default;