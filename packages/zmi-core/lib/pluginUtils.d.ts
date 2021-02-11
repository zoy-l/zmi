import { IPackage } from './types';
interface IResolvePluginsOpts {
    pkg: IPackage;
    cwd: string;
    plugins: string[];
    userConfigPlugins: string[];
}
export declare function pathToRegister({ path: pluginPath, cwd }: {
    path: string;
    cwd: string;
}): {
    id: any;
    key: string;
    path: string;
    apply(): any;
};
export declare function resolvePlugins(opts: IResolvePluginsOpts): {
    id: any;
    key: string;
    path: string;
    apply(): any;
}[];
export declare function isPromise(obj: any): boolean;
export {};
