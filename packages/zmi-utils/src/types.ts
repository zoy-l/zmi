export type NodeEnv = 'development' | 'production' | 'test'

export type ArgsType<T extends (...args: any[]) => any> = T extends (
  ...args: infer U
) => any
  ? U
  : never
