"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printFileSizesAfterBuild = printFileSizesAfterBuild;
exports.measureFileSizesBeforeBuild = measureFileSizesBeforeBuild;

function _recursiveReaddir() {
  const data = _interopRequireDefault(require("recursive-readdir"));

  _recursiveReaddir = function _recursiveReaddir() {
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

function _stripAnsi() {
  const data = _interopRequireDefault(require("strip-ansi"));

  _stripAnsi = function _stripAnsi() {
    return data;
  };

  return data;
}

function _gzipSize() {
  const data = _interopRequireDefault(require("gzip-size"));

  _gzipSize = function _gzipSize() {
    return data;
  };

  return data;
}

function _filesize() {
  const data = _interopRequireDefault(require("filesize"));

  _filesize = function _filesize() {
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

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

function canReadAsset(asset) {
  return /\.(js|css)$/.test(asset) && !/service-worker\.js/.test(asset) && !/precache-manifest\.[0-9a-f]+\.js/.test(asset);
}

function removeFileNameHash(buildFolder, fileName) {
  return fileName.replace(buildFolder, '').replace(/\\/g, '/').replace(/\/?(.*)(\.[0-9a-f]+)(\.chunk)?(\.js|\.css)/, (_match, p1, _p2, _p3, p4) => p1 + p4);
} // Input: 1024, 2048
// Output: "(+1 KB)"


function getDifferenceLabel(currentSize, previousSize) {
  const FIFTY_KILOBYTES = 1024 * 50;
  const difference = currentSize - previousSize;
  const fileSize = !Number.isNaN(difference) ? (0, _filesize().default)(difference) : 0;

  if (difference >= FIFTY_KILOBYTES) {
    return _utils().chalk.red('+' + fileSize);
  }

  if (difference < FIFTY_KILOBYTES && difference > 0) {
    return _utils().chalk.yellow('+' + fileSize);
  }

  if (difference < 0) {
    return _utils().chalk.green(`${fileSize}`);
  }

  return '';
} // Prints a detailed summary of build files.


function printFileSizesAfterBuild(webpackStats, previousSizeMap, buildFolder, maxBundleGzipSize = WARN_AFTER_BUNDLE_GZIP_SIZE, maxChunkGzipSize = WARN_AFTER_CHUNK_GZIP_SIZE) {
  const root = previousSizeMap.root;
  const sizes = previousSizeMap.sizes;
  const assets = (webpackStats.stats || [webpackStats]).map(stats => {
    var _stats$toJson$assets;

    return (_stats$toJson$assets = stats.toJson({
      all: false,
      assets: true
    }).assets) === null || _stats$toJson$assets === void 0 ? void 0 : _stats$toJson$assets.filter(asset => canReadAsset(asset.name)).map(asset => {
      const fileContents = _fs().default.readFileSync(_path().default.join(root, asset.name));

      const size = _gzipSize().default.sync(fileContents);

      const previousSize = sizes[removeFileNameHash(root, asset.name)];
      const difference = getDifferenceLabel(size, previousSize);
      return {
        folder: _path().default.join(_path().default.basename(buildFolder), _path().default.dirname(asset.name)),
        name: _path().default.basename(asset.name),
        size,
        sizeLabel: (0, _filesize().default)(size) + (difference ? ' (' + difference + ')' : '')
      };
    });
  }).reduce((single, all) => all.concat(single), []);
  assets.sort((a, b) => b.size - a.size);
  const longestSizeLabelLength = Math.max.apply(null, assets.map(a => (0, _stripAnsi().default)(a.sizeLabel).length));
  let suggestBundleSplitting = false;
  assets.forEach(asset => {
    let sizeLabel = asset.sizeLabel;
    const sizeLength = (0, _stripAnsi().default)(sizeLabel).length;

    if (sizeLength < longestSizeLabelLength) {
      const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
      sizeLabel += rightPadding;
    }

    const isMainBundle = asset.name.indexOf('main.') === 0;
    const maxRecommendedSize = isMainBundle ? maxBundleGzipSize : maxChunkGzipSize;
    const isLarge = maxRecommendedSize && asset.size > maxRecommendedSize;

    if (isLarge && _path().default.extname(asset.name) === '.js') {
      suggestBundleSplitting = true;
    }

    console.log('➜  ' + _utils().chalk.dim(`${asset.folder}${_path().default.sep}`) + _utils().chalk.cyan(asset.name) + '  ' + (isLarge ? _utils().chalk.yellow(sizeLabel) : sizeLabel));
  });

  if (suggestBundleSplitting) {
    console.log();
    console.log(_utils().chalk.yellow('The bundle size is significantly larger than recommended.'));
    console.log(_utils().chalk.yellow('Consider reducing it with code splitting: https://goo.gl/9VhYWB'));
    console.log(_utils().chalk.yellow('You can also analyze the project dependencies: https://goo.gl/LeUzfb'));
  }
}

function measureFileSizesBeforeBuild(buildFolder) {
  return new Promise(resolve => {
    (0, _recursiveReaddir().default)(buildFolder, (err, fileNames) => {
      var _sizes;

      let sizes;

      if (!err && fileNames) {
        sizes = fileNames.filter(canReadAsset).reduce((memo, fileName) => {
          const contents = _fs().default.readFileSync(fileName);

          const key = removeFileNameHash(buildFolder, fileName);
          memo[key] = (0, _gzipSize().default)(contents);
          return memo;
        }, {});
      }

      resolve({
        root: buildFolder,
        sizes: (_sizes = sizes) !== null && _sizes !== void 0 ? _sizes : {}
      });
    });
  });
}