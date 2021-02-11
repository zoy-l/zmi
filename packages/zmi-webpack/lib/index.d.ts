import WebpackDevServer from 'webpack-dev-server';
import defaultWebpack from 'webpack';
import { IGetConfigOpts } from './getConfig';
interface ISetupOpts {
    bundleConfigs: defaultWebpack.Configuration & {
        devServer: WebpackDevServer.Configuration;
    };
    bundleImplementor: typeof defaultWebpack;
    port: number;
    host: string;
    appName?: string;
}
interface IOpts {
    cwd: string;
    config: any;
    pkg: Record<string, any>;
}
export default class Bundler {
    cwd: string;
    config: any;
    pkg: {};
    constructor({ cwd, config, pkg }: IOpts);
    getConfig(options: IGetConfigOpts): Promise<defaultWebpack.Configuration>;
    setupDevServer(options: ISetupOpts): Promise<WebpackDevServer>;
    build(options: {
        bundleConfigs: defaultWebpack.Configuration;
        bundleImplementor: typeof defaultWebpack;
        appOutputPath: string;
    }): Promise<defaultWebpack.Stats | undefined>;
}
export {};
