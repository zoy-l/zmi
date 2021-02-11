import webpack from 'webpack';
interface IUrlType {
    lanUrlForTerminal: string | undefined;
    localUrlForTerminal: string;
    lanUrlForConfig: any;
}
interface IPrepareUrlOpts {
    protocol?: 'http' | 'https';
    port: string | number;
    pathname?: string;
    host: string;
}
export declare function prepareUrls(prepareUrlOptions: IPrepareUrlOpts): {
    lanUrlForConfig: any;
    lanUrlForTerminal: string | undefined;
    localUrlForTerminal: string;
};
declare function createCompiler(opts: {
    bundleImplementor: typeof webpack;
    config: webpack.Configuration;
    appName: string;
    urls: IUrlType;
    port: number;
}): webpack.Compiler;
export default createCompiler;
