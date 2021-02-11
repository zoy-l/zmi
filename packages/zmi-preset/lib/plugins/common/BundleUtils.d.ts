import { IApi } from '@zmi/types';
import DefaultBundler from '@zmi/webpack';
export declare function getBundleAndConfigs(options: {
    api: IApi;
    port?: number;
}): Promise<{
    bundleImplementor: any;
    bundleConfigs: any;
    bundler: DefaultBundler;
}>;
