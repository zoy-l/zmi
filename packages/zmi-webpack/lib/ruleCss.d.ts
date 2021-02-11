import Config from 'webpack-chain';
interface IOpts {
    webpackConfig: Config;
    config: any;
    isDev: boolean;
    disableCompress?: boolean;
    browserslist?: Record<string, any>;
    sourceMap: boolean;
}
interface ICreateCSSRuleOpts {
    lang: string;
    test: RegExp;
    loader?: string;
    options?: Record<string, any>;
}
declare const _default: (options: IOpts) => (createCSSRuleOptions: ICreateCSSRuleOpts) => void;
export default _default;
