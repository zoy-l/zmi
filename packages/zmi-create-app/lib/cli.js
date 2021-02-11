"use strict";

function _utils() {
  const data = require("@zmi/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

var _AppGenerator = _interopRequireDefault(require("./AppGenerator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _utils().launchDevice)(_utils().dyo).then(({
  args
}) => {
  if (args.version && !args._[0]) {
    const _require = require('../package'),
          version = _require.version;

    console.log(version);
  } else {
    (0, _AppGenerator.default)(process.cwd(), args);
  }
});