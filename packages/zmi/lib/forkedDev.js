"use strict";

function _utils() {
  const data = require("@zmi-cli/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

var _getRoot = require("./getRoot");

var _service = _interopRequireDefault(require("./service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _utils().launchDevice)().then(({
  args
}) => {
  const Signals = ['SIGINT', 'SIGQUIT', 'SIGTERM'];

  try {
    process.env.NODE_ENV = 'development';
    const service = new _service.default({
      cwd: (0, _getRoot.getCwd)(),
      pkg: (0, _getRoot.getPkg)(process.cwd())
    });
    service.run({
      command: 'dev',
      args
    });
    Signals.forEach(signal => {
      process.once(signal, () => {
        service.applyPlugins({
          key: 'onExit',
          type: service.ApplyPluginsType.event,
          args: {
            signal
          }
        });
        process.exit(0);
      });
    });
  } catch (e) {
    console.error(_utils().chalk.red(e.message));
    console.error(e.stack);
    process.exit(1);
  }
});