const { prettier } = require('eslint-config-zmi')
const { recursiveReaddir } = require('@zmi-cli/utils')
const path = require('path')
const fs = require('fs')

const cwd = path.join(__dirname, '../zmi-preset/lib/plugins/features')
const aims = path.join(__dirname, './src/defaultConfig.ts')

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
      // @-ignore
    }
  })

  fs.writeFileSync(
    aims,
    prettier.format(
      `// when using @zmi/webpack alone
       // The logic here is similar to the preset logic, but does not conflict
       export default ${JSON.stringify(defaultConfig)}`,
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
