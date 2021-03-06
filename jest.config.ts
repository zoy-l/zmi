import { jestConfig } from 'zmi-nerd'

export default {
  collectCoverageFrom(memo) {
    return memo.concat([
      '!packages/zmi-preset/src/plugins/features/*',
      '!packages/zmi-preset/src/plugins/commands/*',
      '!packages/zmi-preset/src/plugins/common/BundleUtils.ts',
      '!packages/zmi-preset/src/plugins/common/generateHtml.ts',
      '!packages/zmi-preset/src/plugins/registerMethods.ts',

      '!packages/zmi/src/cli.ts',
      '!packages/zmi/src/forkedDev.ts',
      '!packages/zmi/src/fork.ts',
      '!packages/zmi-create-app/src/cli.ts',

      '!packages/zmi-utils/src/index.ts',
      '!packages/zmi-utils/src/clearConsole.ts',
      '!packages/zmi-utils/src/launchDevice.ts'
    ])
  }
} as jestConfig
