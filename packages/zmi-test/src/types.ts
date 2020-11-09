import { ArgsType } from '@zmi/utils'
import { runCLI } from 'jest'
import { options as CliOptions } from 'jest-cli/build/cli/args'

export interface IZmiTestArgs extends Partial<ArgsType<typeof runCLI>['0']> {
  version?: boolean
  cwd?: string
  debug?: boolean
  e2e?: boolean
  package?: string
}

export type PickedJestCliOptions = {
  [T in keyof typeof CliOptions]?: T extends keyof IZmiTestArgs[T]
    ? T
    : typeof CliOptions[T] extends { alias: string | undefined }
    ? IZmiTestArgs[T]
    : never
}
