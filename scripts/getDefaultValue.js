const { recursiveReaddir } = require('../packages/zmi-utils/lib')
const { prettier } = require('eslint-config-zmi')
const path = require('path')
const fs = require('fs')

const aims = path.join(__dirname, '../packages/zmi-webpack/src/defaultConfig.ts')
const cwd = path.join(__dirname, '../packages/zmi-preset/lib/plugins/features')

recursiveReaddir(cwd).then((files) => {
  const defaultConfig = {}
  files.forEach((file) => {
    try {
      require(file).default({
        describe(opt) {
          defaultConfig[opt.key] = opt.config.default
        }
      })
    } catch {
      // ignore
    }
  })

  fs.writeFileSync(
    aims,
    prettier.format(
      `// when using @zmi/webpack alone
       // The logic here is similar to the preset logic, but does not conflict
       const configDefault = ${JSON.stringify(defaultConfig)}
       export const htmlDefaultOptions = {
          headScripts: [],
          scripts: [],
          styles: [],
          metas: [],
          links: [],
          config: configDefault
        };
       export default configDefault`,
      {
        parser: 'babel-ts',
        singleQuote: true,
        trailingComma: 'none',
        printWidth: 100,
        proseWrap: 'never',
        arrowParens: 'always',
        semi: false
      }
    ),
    'utf-8'
  )
})
