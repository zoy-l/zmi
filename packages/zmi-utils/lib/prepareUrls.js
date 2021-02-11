"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prepareUrls;

function _url() {
  const data = _interopRequireDefault(require("url"));

  _url = function _url() {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function _chalk() {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const urlRe = /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/;

function prepareUrls(opts) {
  const protocol = opts.protocol,
        host = opts.host,
        port = opts.port,
        _opts$pathname = opts.pathname,
        pathname = _opts$pathname === void 0 ? '/' : _opts$pathname;

  const formatUrl = hostname => _url().default.format({
    protocol,
    hostname,
    port,
    pathname
  });

  const prettyPrintUrl = hostname => _url().default.format({
    protocol,
    hostname,
    port: _chalk().default.bold(`${port}`),
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
        if (urlRe.test(lanUrlForConfig)) {
          lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
        } else {
          lanUrlForConfig = undefined;
        }
      }
    } catch (_e) {// ignored
    }
  } else {
    prettyHost = host;
  }

  const localUrlForTerminal = prettyPrintUrl(prettyHost);
  const localUrlForBrowser = formatUrl(prettyHost);
  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal,
    localUrlForBrowser
  };
}