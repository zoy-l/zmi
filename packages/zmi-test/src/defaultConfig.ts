import { isLerna as isLernaPackage } from '@zmi/utils'
import assert from 'assert'
import path from 'path'
import fs from 'fs'

import { IZmiTestArgs } from './types'

export default function defaultConfig(cwd: string, args: IZmiTestArgs) {
  const testMatchTypes = ['spec', 'test']
  const isLerna = isLernaPackage(cwd)
  const hasPackage = isLerna && args.package
  const testMatchPrefix = hasPackage ? `**/packages/${args.package}/` : ''
  const hasSrc = fs.existsSync(path.join(cwd, 'src'))

  if (hasPackage) {
    assert(
      fs.existsSync(path.join(cwd, 'packages', args.package!)),
      `You specified --package, but packages/${args.package} does not exists.`
    )
  }

  return {
    collectCoverageFrom: [
      'index.{js,jsx,ts,tsx}',
      hasSrc && 'src/**/*.{js,jsx,ts,tsx}',
      isLerna && !args.package && 'packages/*/src/**/*.{js,jsx,ts,tsx}',
      isLerna &&
        args.package &&
        `packages/${args.package}/src/**/*.{js,jsx,ts,tsx}`,
      '!**/typings/**',
      '!**/types/**',
      '!**/fixtures/**',
      '!**/examples/**',
      '!**/*.d.ts'
    ].filter(Boolean),

    setupFilesAfterEnv: [require.resolve('../helpers/jasmine')],
    testPathIgnorePatterns: ['/node_modules/', '/fixtures/'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    setupFiles: [require.resolve('../helpers/shim')],
    testEnvironment: 'jest-environment-jsdom-global',

    moduleNameMapper: {
      '\\.(css|less|sass|scss|stylus)$': 'identity-obj-proxy'
    },
    testMatch: [
      `${testMatchPrefix}**/?*.(${testMatchTypes.join('|')}).(j|t)s?(x)`
    ],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': require.resolve('../helpers/javascript'),
      '^.+\\.(css|less|sass|scss|stylus)$': require.resolve('../helpers/css'),
      '^(?!.*\\.(js|jsx|ts|tsx|css|less|sass|scss|stylus|json)$)': require.resolve(
        '../helpers/file'
      )
    },
    verbose: true,
    ...(process.env.MAX_WORKERS
      ? { maxWorkers: Number(process.env.MAX_WORKERS) }
      : {})
  }
}
