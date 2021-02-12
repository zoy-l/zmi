import WebpackChain from 'webpack-chain';
import defaultWebpack from 'webpack';
import { IPrivate } from '@zmi-cli/types';
export interface IGetConfigOpts {
    chainWebpack?: (webpackConfig: WebpackChain, args: Record<string, any>) => Promise<any>;
    modifyBabelPresetOpts?: <T>(opts: T) => Promise<T> | T;
    modifyBabelOpts?: <T>(opts: T) => Promise<T> | T;
    bundleImplementor?: typeof defaultWebpack;
    env: 'development' | 'production';
    entry: Record<string, any>;
    pkg: Record<string, any>;
    htmlContent: string;
    config: IPrivate;
    hot?: boolean;
    port?: number;
    cwd: string;
}
export default function getConfig(opts: IGetConfigOpts): Promise<defaultWebpack.Configuration>;
