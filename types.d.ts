declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | 'test'
    APP_ROOT: string
    HOST: string
    PORT: string
    ZMI_TEST: string
    ANALYZER: string
  }
}
