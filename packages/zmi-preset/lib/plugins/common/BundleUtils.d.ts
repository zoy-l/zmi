import { IApi } from '@zmi-cli/types';
import DefaultBundler from '@zmi-cli/webpack';
export declare function getBundleAndConfigs(options: {
    api: IApi;
    port?: number;
}): Promise<{
    bundleImplementor: any;
    bundleConfigs: any;
    bundler: DefaultBundler;
}>;
