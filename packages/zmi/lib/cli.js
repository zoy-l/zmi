"use strict";

function _utils() {
  const data = require("@zmi/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _readline() {
  const data = _interopRequireDefault(require("readline"));

  _readline = function _readline() {
    return data;
  };

  return data;
}

var _getRoot = require("./getRoot");

var _service = _interopRequireDefault(require("./service"));

var _fork = _interopRequireDefault(require("./fork"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _utils().launchDevice)(_utils().dyo).then(({
  args,
  command
}) => {
  const Signals = ['SIGINT', 'SIGTERM'];

  try {
    switch (command) {
      case 'dev':
        const child = (0, _fork.default)({
          scriptPath: require.resolve('./forkedDev')
        });

        if (_utils().isWin) {
          const rl = _readline().default.createInterface({
            input: process.stdin,
            output: process.stdout
          });

          rl.on(Signals[0], () => {
            process.emit(Signals[0], Signals[0]);
          });
        }

        Signals.forEach(SignalKey => {
          process.on(SignalKey, () => {
            child.kill(SignalKey);
            process.exit(1);
          });
        });
        break;

      default:
        if (command === 'build') {
          process.env.NODE_ENV = 'production';
        }

        (0, _utils().clearConsole)();
        new _service.default({
          cwd: (0, _getRoot.getCwd)(),
          pkg: (0, _getRoot.getPkg)(process.cwd())
        }).run({
          command,
          args
        });
        break;
    }
  } catch (err) {
    console.log(_utils().chalk.red(err.message));
    console.log(err.stack);
    process.exit(1);
  }
});