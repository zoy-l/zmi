"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _utils() {
  const data = require("@zmi-cli/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _prettier() {
  const data = _interopRequireDefault(require("prettier"));

  _prettier = function _prettier() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _ejs() {
  const data = _interopRequireDefault(require("ejs"));

  _ejs = function _ejs() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

class Html {
  constructor(opts) {
    this.config = opts.config;
    this.tplPath = opts.tplPath;
  }

  getHtmlPath(path) {
    var _this$config$exportSt;

    if (path === '/') {
      return 'index.html';
    } // remove first and last slash


    path = path.replace(/^\//, '');
    path = path.replace(/\/$/, '');

    if ((_this$config$exportSt = this.config.exportStatic) !== null && _this$config$exportSt !== void 0 && _this$config$exportSt.htmlSuffix || path === 'index.html') {
      return `${path}`;
    }

    return `${path}/index.html`;
  }

  getRelPathToPublicPath(path) {
    var _this$config$exportSt2;

    const htmlPath = this.getHtmlPath(path);
    const len = htmlPath.split('/').length;
    return Array((_this$config$exportSt2 = this.config.exportStatic) !== null && _this$config$exportSt2 !== void 0 && _this$config$exportSt2.htmlSuffix ? len : len - 1).join('../') || './';
  }

  getAsset(opts) {
    var _this$config$exportSt3;

    if (/^https?:\/\//.test(opts.file)) {
      return opts.file;
    }

    const file = opts.file.charAt(0) === '/' ? opts.file.slice(1) : opts.file;

    if ((_this$config$exportSt3 = this.config.exportStatic) !== null && _this$config$exportSt3 !== void 0 && _this$config$exportSt3.dynamicRoot) {
      var _opts$path;

      return `${this.getRelPathToPublicPath((_opts$path = opts.path) !== null && _opts$path !== void 0 ? _opts$path : '/')}${file}`;
    }

    return `${this.config.publicPath}${file}`;
  }

  getScriptsContent(scripts) {
    return scripts.map(script => {
      const content = script.content,
            attrs = _objectWithoutProperties(script, ["content"]);

      if (content && !attrs.src) {
        const newAttrs = Object.keys(attrs).reduce((memo, key) => [...memo, `${key}="${attrs[key]}"`], []);
        return [`<script${newAttrs.length ? ' ' : ''}${newAttrs.join(' ')}>`, content.split('\n').map(line => `  ${line}`).join('\n'), '</script>'].join('\n');
      }

      const newAttrs = Object.keys(attrs).reduce((memo, key) => [...memo, `${key}="${attrs[key]}"`], []);
      return `<script ${newAttrs.join(' ')}></script>`;
    }).join('\n');
  }

  getContent(args) {
    var _this = this;

    return _asyncToGenerator(function* () {
      var _this$config$mountEle;

      const _args$tplPath = args.tplPath,
            tplPath = _args$tplPath === void 0 ? _this.tplPath : _args$tplPath,
            _args$headJSFiles = args.headJSFiles,
            headJSFiles = _args$headJSFiles === void 0 ? [] : _args$headJSFiles,
            _args$headScripts = args.headScripts,
            headScripts = _args$headScripts === void 0 ? [] : _args$headScripts,
            _args$cssFiles = args.cssFiles,
            cssFiles = _args$cssFiles === void 0 ? [] : _args$cssFiles,
            _args$scripts = args.scripts,
            scripts = _args$scripts === void 0 ? [] : _args$scripts,
            _args$jsFiles = args.jsFiles,
            jsFiles = _args$jsFiles === void 0 ? [] : _args$jsFiles,
            _args$styles = args.styles,
            styles = _args$styles === void 0 ? [] : _args$styles,
            _args$metas = args.metas,
            metas = _args$metas === void 0 ? [] : _args$metas,
            _args$links = args.links,
            links = _args$links === void 0 ? [] : _args$links,
            modifyHTML = args.modifyHTML;

      if (tplPath) {
        (0, _utils().assert)(`getContent() failed, tplPath of ${tplPath} not exists.`, (0, _fs().existsSync)(tplPath));
      }

      const tpl = (0, _fs().readFileSync)(tplPath || (0, _path().join)(__dirname, 'document.ejs'), 'utf-8');
      const context = {
        config: _this.config
      };

      let html = _ejs().default.render(tpl, context, {
        _with: false,
        localsName: 'context',
        filename: 'document.ejs'
      });

      let $ = _utils().cheerio.load(html, {
        decodeEntities: false
      }); // metas


      metas.forEach(meta => {
        $('head').append(['<meta', ...Object.keys(meta).reduce((memo, key) => memo.concat(`${key}="${meta[key]}"`), []), '/>'].join(' '));
      }); // links

      links.forEach(link => {
        $('head').append(['<link', ...Object.keys(link).reduce((memo, key) => memo.concat(`${key}="${link[key]}"`), []), '/>'].join(' '));
      }); // styles

      styles.forEach(style => {
        const _style$content = style.content,
              content = _style$content === void 0 ? '' : _style$content,
              attrs = _objectWithoutProperties(style, ["content"]);

        const newAttrs = Object.keys(attrs).reduce((memo, key) => memo.concat(`${key}="${attrs[key]}"`), []);
        $('head').append([`<style${newAttrs.length ? ' ' : ''}${newAttrs.join(' ')}>`, content.split('\n').map(line => `  ${line}`).join('\n'), '</style>'].join('\n'));
      }); // css

      cssFiles.forEach(file => {
        $('head').append(`<link rel="stylesheet" href="${_this.getAsset({
          file
        })}" />`);
      }); // root element

      const mountElementId = (_this$config$mountEle = _this.config.mountElementId) !== null && _this$config$mountEle !== void 0 ? _this$config$mountEle : 'root';

      if (!$(`#${mountElementId}`).length) {
        const bodyEl = $('body');
        (0, _utils().assert)('<body> not found in html template.', bodyEl.length);
        bodyEl.append(`<div id="${mountElementId}"></div>`);
      } // js


      if (headScripts.length) {
        $('head').append(_this.getScriptsContent(headScripts));
      }

      headJSFiles.forEach(file => {
        $('head').append(`<script src="${_this.getAsset({
          file
        })}"></script>`);
      });

      if (scripts.length) {
        $('body').append(_this.getScriptsContent(scripts));
      }

      jsFiles.forEach(file => {
        $('body').append(`<script src="${_this.getAsset({
          file
        })}"></script>`);
      });

      if (modifyHTML) {
        $ = yield modifyHTML($);
      }

      html = $.html(); // Node 8 not support prettier v2
      // https://github.com/prettier/eslint-plugin-prettier/issues/278

      try {
        html = _prettier().default.format(html, {
          parser: 'html'
        });
      } catch (_unused) {// ig-ignore
      }

      return html;
    })();
  }

}

var _default = Html;
exports.default = _default;