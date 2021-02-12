"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chunksToFiles = chunksToFiles;
exports.getHtmlGenerator = getHtmlGenerator;

function _utils() {
  const data = require("@zmi-cli/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function chunksToFiles(opts) {
  let chunksMap = {};

  if (opts.chunks) {
    chunksMap = opts.chunks.reduce((memo, chunk) => {
      const key = chunk.name || chunk.id;

      if (key && chunk.files) {
        chunk.files.forEach(file => {
          if (!file.includes('.hot-update')) {
            memo[`${key}${_path().default.extname(file)}`] = file;
          }
        });
      }

      return memo;
    }, {});
  }

  const cssFiles = [];
  const jsFiles = [];
  const headJSFiles = [];
  const htmlChunks = opts.htmlChunks.map(htmlChunk => _utils().lodash.isPlainObject(htmlChunk) ? htmlChunk : {
    name: htmlChunk
  });
  htmlChunks.forEach(({
    name,
    headScript
  }) => {
    const cssFile = opts.noChunk ? `${name}.css` : chunksMap[`${name}.css`];

    if (cssFile) {
      cssFiles.push(cssFile);
    }

    const jsFile = opts.noChunk ? `${name}.js` : chunksMap[`${name}.js`];
    (0, _utils().assert)(`chunk of ${name} not found.`, jsFile);

    if (headScript) {
      headJSFiles.push(jsFile);
    } else {
      jsFiles.push(jsFile);
    }
  });
}

function getHtmlGenerator({
  api
}) {
  function getDocumentTplPath() {
    const docPath = _path().default.join(api.paths.appPagesPath, 'document.ejs');

    return _fs().default.existsSync(docPath) ? docPath : '';
  }

  class Html extends api.Html {
    constructor() {
      super({
        config: api.config,
        tplPath: getDocumentTplPath()
      });
    }

    getContent() {
      var _superprop_getGetContent = () => super.getContent,
          _this = this;

      return _asyncToGenerator(function* () {
        function applyPlugins(_x) {
          return _applyPlugins.apply(this, arguments);
        } // let publicPathStr = JSON.stringify(api.config.publicPath)
        // if (api.config.exportStatic?.dynamicRoot) {
        //   publicPathStr = `location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + window.routerBase`
        // }
        // publicPathStr = await api.applyPlugins({
        //   key: 'modifyPublicPathStr',
        //   type: api.ApplyPluginsType.modify,
        //   initialValue: publicPathStr
        // })
        // const htmlChunks = await api.applyPlugins({
        //   key: 'modifyHTMLChunks',
        //   type: api.ApplyPluginsType.modify,
        //   initialValue: api.config.chunks ?? ['zmi']
        // })
        // const { cssFiles, jsFiles, headJSFiles } = chunksToFiles({
        //   htmlChunks
        // })


        function _applyPlugins() {
          _applyPlugins = _asyncToGenerator(function* (opts) {
            var _opts$initialState;

            return api.applyPlugins({
              key: opts.key,
              type: api.ApplyPluginsType.add,
              initialValue: (_opts$initialState = opts.initialState) !== null && _opts$initialState !== void 0 ? _opts$initialState : []
            });
          });
          return _applyPlugins.apply(this, arguments);
        }

        return _superprop_getGetContent().call(_this, {
          // cssFiles,
          // headJSFiles,
          // jsFiles,
          headScripts: yield applyPlugins({
            key: 'addHTMLHeadScripts'
          }),
          links: yield applyPlugins({
            key: 'addHTMLLinks'
          }),
          metas: yield applyPlugins({
            key: 'addHTMLMetas'
          }),
          scripts: yield applyPlugins({
            key: 'addHTMLScripts'
          }),
          styles: yield applyPlugins({
            key: 'addHTMLStyles'
          }),

          modifyHTML(memo, args) {
            return _asyncToGenerator(function* () {
              return api.applyPlugins({
                key: 'modifyHTML',
                type: api.ApplyPluginsType.modify,
                initialValue: memo,
                args: {
                  args
                }
              });
            })();
          }

        });
      })();
    }

  }

  return new Html();
}