import { jestConfig } from 'zmi-nerd'

export default {
  collectCoverageFrom(memo) {
    return memo.concat(['!packages/zmi-preset/src/plugins/features/*'])
  }
} as jestConfig
