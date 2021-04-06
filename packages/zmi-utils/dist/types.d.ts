export declare type NodeEnv = 'development' | 'production' | 'test'
export declare type ArgsType<T extends (...args: any[]) => any> = T extends (
  ...args: infer U
) => any
  ? U
  : never
