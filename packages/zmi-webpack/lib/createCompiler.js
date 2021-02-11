"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareUrls = prepareUrls;
exports.default = void 0;

function _forkTsCheckerWebpackPlugin() {
  const data = _interopRequireDefault(require("fork-ts-checker-webpack-plugin"));

  _forkTsCheckerWebpackPlugin = function _forkTsCheckerWebpackPlugin() {
    return data;
  };

  return data;
}

function _utils() {
  const data = require("@zmi/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _address() {
  const data = _interopRequireDefault(require("address"));

  _address = function _address() {
    return data;
  };

  return data;
}

function _url() {
  const data = _interopRequireDefault(require("url"));

  _url = function _url() {
    return data;
  };

  return data;
}

var _formatWebpackMessages = _interopRequireDefault(require("./formatWebpackMessages"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const urlRegex = /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/;

function prepareUrls(prepareUrlOptions) {
  const _prepareUrlOptions$pr = prepareUrlOptions.protocol,
        protocol = _prepareUrlOptions$pr === void 0 ? 'http' : _prepareUrlOptions$pr,
        host = prepareUrlOptions.host,
        port = prepareUrlOptions.port,
        _prepareUrlOptions$pa = prepareUrlOptions.pathname,
        pathname = _prepareUrlOptions$pa === void 0 ? '/' : _prepareUrlOptions$pa;

  const formatUrl = hostname => _url().default.format({
    protocol,
    hostname,
    port,
    pathname
  });

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
  let prettyHost;
  let lanUrlForConfig;
  let lanUrlForTerminal;

  if (isUnspecifiedHost) {
    prettyHost = 'localhost';

    try {
      lanUrlForConfig = _address().default.ip();

      if (lanUrlForConfig) {
        if (urlRegex.test(lanUrlForConfig)) {
          lanUrlForTerminal = formatUrl(lanUrlForConfig);
        } else {
          lanUrlForConfig = undefined;
        }
      }
    } catch (_unused) {// ignored
    }
  } else {
    prettyHost = host;
  }

  const localUrlForTerminal = formatUrl(prettyHost);
  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal
  };
}

function printInstructions(opts) {
  const appName = opts.appName,
        urls = opts.urls,
        port = opts.port;

  const yellow = _utils().chalk.yellow,
        cyan = _utils().chalk.cyan;

  const _console = console,
        log = _console.log; // devConifg.target !== 'web' &&
  // After `chalk` changes the color, the length of the string is not accurate
  // needs to be calculated manually

  const appNameLine = `│ You can now view your Project: ${yellow(appName)}  │`;
  const appNameLineLength = 36 + appName.length;
  log(['┌'.padEnd(appNameLineLength - 1, '─') + '┐', `│ Running metro bundler on Port: ${yellow(`${port}`.padEnd(appNameLineLength - 34))}│`, appNameLine, '├'.padEnd(appNameLineLength - 1, '─') + '┤'].join('\n'));

  if (urls.lanUrlForTerminal) {
    log(`│ Localhost: ${cyan(urls.localUrlForTerminal.padEnd(appNameLineLength - 14))}│`);
    log(`│ Network:   ${cyan(urls.lanUrlForTerminal.padEnd(appNameLineLength - 14))}│`);
  } else {
    log(`│ Localhost: ${cyan(urls.localUrlForTerminal.padEnd(appNameLineLength - 14))}`);
  }

  log('└'.padEnd(appNameLineLength - 1, '─') + '┘');
}

function createCompiler(opts) {
  const appName = opts.appName,
        config = opts.config,
        urls = opts.urls,
        port = opts.port,
        bundleImplementor = opts.bundleImplementor;
  const _console2 = console,
        log = _console2.log;
  let compiler;

  try {
    compiler = bundleImplementor(config);
  } catch (err) {
    var _err$message;

    log(_utils().chalk.red('❌ Compilation failed.'));
    log();
    log((_err$message = err.message) !== null && _err$message !== void 0 ? _err$message : err);
    process.exit(1);
  } // I don't know what happened,
  // I need to return a Date type


  compiler.hooks.invalid.tap('invalid', () => {
    (0, _utils().clearConsole)();
    log(_utils().chalk.cyan('Accelerating compilation ,Wait a moment...'));
    log();
  });

  const forkHook = _forkTsCheckerWebpackPlugin().default.getCompilerHooks(compiler);

  forkHook.issues.tap('ForkTsCheckerWebpackPlugin', issues => {
    if (issues.length) {//
    }

    return issues;
  });
  compiler.hooks.done.tap('done', stats => {
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true
    });
    const messages = (0, _formatWebpackMessages.default)(statsData);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
      (0, _utils().clearConsole)();
      log(_utils().chalk.bgBlue.black(' DONE '), _utils().chalk.blue('Compiled successfully !'));
      printInstructions({
        appName,
        urls,
        port
      });
    } // isFirstCompile = false


    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }

      (0, _utils().clearConsole)();
      log('\n');
      log(_utils().chalk.red('❌ Compilation failed.\n'));
      log(_utils().chalk.red(messages.errors.join('\n\n')));
      log();
      return;
    }

    if (messages.warnings.length) {
      log(_utils().chalk.yellow(`🚸 Compile warning.\n`));
      log(messages.warnings.join('\n\n'));
      log();
    }
  });
  return compiler;
}

var _default = createCompiler;
exports.default = _default;