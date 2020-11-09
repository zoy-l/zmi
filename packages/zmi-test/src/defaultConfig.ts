import { ILmiTestArgs } from './types'

export default function defaultConfig(_cwd: string, _args: ILmiTestArgs) {
  console.log(_cwd, _args)
  return {
    collectCoverageFrom: [],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    verbose: true,
    ...(process.env.MAX_WORKERS
      ? { maxWorkers: Number(process.env.MAX_WORKERS) }
      : {})
  }
}
