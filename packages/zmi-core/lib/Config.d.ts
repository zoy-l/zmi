import { IChanged } from './types';
import { Service } from '.';
interface IWatchOptions {
    userConfig: Record<string, any>;
    onChange: (args: {
        userConfig: any;
        pluginChanged: IChanged[];
        valueChanged: IChanged[];
    }) => void;
}
export default class Config {
    /**
     * @desc Directory path
     */
    cwd: string;
    /**
     * @desc file name
     */
    configFile?: string;
    /**
     * @desc Service instance
     */
    service: Service;
    constructor(options: {
        cwd: string;
        service: Service;
    });
    getDefaultConfig(): {};
    getConfig(defaultConfig: {
        [key: string]: any;
    }): {};
    getConfigFile(): string | undefined;
    getUserConfig(): {};
    addAffix(file: string, affix: string, isExt?: boolean): string;
    requireConfigs(configFiles: string[]): any[];
    mergeConfig(configs: string[]): {};
    getWatchFilesAndDirectories(): string[];
    watch(opts: IWatchOptions): void;
}
export {};
