import DefaultBundler from '@zmi-cli/webpack';
import { IApi } from '@zmi-cli/types';
export declare function getBundleAndConfigs(options: {
    api: IApi;
    port?: number;
}): Promise<{
    bundleImplementor: any;
    bundleConfigs: any;
    bundler: DefaultBundler;
}>;
