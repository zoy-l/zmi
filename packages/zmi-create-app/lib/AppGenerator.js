"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generator;

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

function generator(_x, _x2) {
  return _generator.apply(this, arguments);
}

function _generator() {
  _generator = _asyncToGenerator(function* (cwd, args) {
    const yellow = _utils().chalk.yellow,
          cyan = _utils().chalk.cyan,
          green = _utils().chalk.green,
          blue = _utils().chalk.blue,
          magenta = _utils().chalk.magenta;

    let appName = args._[0];

    const directoryList = _fs().default.readdirSync(cwd).filter(file => _fs().default.lstatSync(`${cwd}/${file}`).isDirectory());

    if (!appName) {
      const _yield$inquirer$promp = yield _utils().inquirer.prompt({
        type: 'input',
        name: 'IAppName',
        message: yellow.bold('please enter project name:'),
        default: 'zmi-project'
      }),
            IAppName = _yield$inquirer$promp.IAppName;

      appName = IAppName;
    }

    let IappName = appName;
    const isEmptyDir = _fs().default.existsSync(IappName) && !!_fs().default.readdirSync(`${cwd}/${IappName}`).length; // eslint-disable-next-line no-constant-condition

    while (true) {
      if (isEmptyDir) {
        const _yield$inquirer$promp2 = yield _utils().inquirer.prompt({
          type: 'input',
          name: 'newAppName',
          message: yellow([`The \`${cyan(IappName)}\` `, 'folder already exists and is not empty.\n', 'please enter a new project name : '].join('')),
          prefix: '⚠️ '
        }),
              newAppName = _yield$inquirer$promp2.newAppName;

        if (!directoryList.includes(`${newAppName}`)) {
          cwd += `/${newAppName}`;
          break;
        } else {
          IappName = `${newAppName}`;
        }
      } else {
        cwd += `/${IappName}`;
        break;
      }
    }

    const _yield$inquirer$promp3 = yield _utils().inquirer.prompt({
      type: 'list',
      name: 'template',
      message: yellow('Choose the template you want'),
      choices: [{
        name: blue('react'),
        value: 'react'
      }, {
        name: blue('react-ts'),
        value: 'react-ts'
      }, {
        name: cyan('vue'),
        value: 'vue'
      }, {
        name: cyan('vue-ts'),
        value: 'vue-ts'
      }, {
        name: green('miniapp'),
        value: 'miniapp'
      }]
    }),
          template = _yield$inquirer$promp3.template;

    const templatePath = _path().default.join(__dirname, `../templates/${template}`);

    const context = {
      version: require('../package').version
    };

    const files = _utils().glob.sync('**/*', {
      ignore: ['**/node_modules/**'],
      cwd: templatePath,
      dot: true
    });

    files.forEach(file => {
      const absFile = _path().default.join(templatePath, file);

      if (_fs().default.statSync(absFile).isDirectory()) return;

      if (file.endsWith('.tpl')) {
        const target = _path().default.join(cwd, file.replace(/\.tpl$/, ''));

        const tpl = _fs().default.readFileSync(absFile, 'utf-8');

        const content = _utils().mustache.render(tpl, context);

        _utils().mkdirp.sync(_path().default.dirname(target));

        console.log(`${magenta('[Make]: ')} ${_path().default.relative(cwd, target)}`);

        _fs().default.writeFileSync(target, content, 'utf-8');
      } else {
        console.log(`${magenta('[Make]: ')} ${file}`);

        const absTarget = _path().default.join(cwd, file);

        _utils().mkdirp.sync(_path().default.dirname(absTarget));

        _fs().default.copyFileSync(absFile, absTarget);
      }
    });
    console.log(['┌────────────────────────────────────┐', '│ Install dependencies: $ yarn       |', '│ Start the dev server: $ yarn start |', '└────────────────────────────────────┘'].join('\n'));
  });
  return _generator.apply(this, arguments);
}