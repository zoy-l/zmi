/// <reference types="yargs-parser" />
/// <reference types="node" />
import { BabelRegister, NodeEnv, yargsParser } from '@zmi/utils';
import { EventEmitter } from 'events';
import PluginAPI, { IPluginAPIOptions } from './PluginAPI';
import Config from './Config';
import { ConfigChangeType, EnumApplyPlugins, IServicePaths, EnumEnableBy, ServiceStage, IPackage, ICommand, IPlugin, IHook } from './types';
interface IRun {
    command: string;
    args: yargsParser.Arguments;
}
interface IApplyPlugins {
    key: string;
    type: EnumApplyPlugins;
    initialValue?: any;
    args?: any;
}
export interface IServiceOptions {
    cwd: string;
    env?: NodeEnv;
    pkg?: IPackage;
    plugins?: string[];
}
export interface IConfig {
    plugins?: string[];
    [key: string]: any;
}
export default class Service extends EventEmitter {
    /**
     * @desc Directory path
     */
    cwd: string;
    /**
     * @desc Directory package.json
     */
    pkg: IPackage;
    /**
     * @desc Environment variable
     */
    env: string | undefined;
    /**
     * @desc Plug-in to be registered
     */
    extraPlugins: IPlugin[];
    /**
     * @desc Config Instance
     */
    configInstance: Config;
    /**
     * @desc user config
     */
    userConfig: IConfig;
    /**
     * @desc runtime babel
     */
    babelRegister: BabelRegister;
    /**
     * @desc initial Plugins
     */
    initialPlugins: IPlugin[];
    /**
     * @desc registered commands
     */
    commands: Record<string, ICommand | string>;
    /**
     * @desc plugin Methods
     */
    pluginMethods: Record<string, ((args: yargsParser.Arguments) => void) | ((fn: typeof Function) => void)>;
    /**
     * @desc plugin set
     */
    plugins: Record<string, IPlugin>;
    /**
     * @desc hooks
     */
    hooks: Record<string, IHook[]>;
    /**
     * @desc { Record<string, IHook[]> }
     */
    hooksByPluginId: Record<string, IHook[]>;
    /**
     * @desc The id of the plugin that does not need to be loaded
     */
    skipPluginIds: Set<string>;
    /**
     * @desc How to enable the plug-in, the default is to register and enable
     */
    EnableBy: typeof EnumEnableBy;
    /**
     * @desc Apply Plugin enumeration value, provide a plug-in use
     */
    ApplyPluginsType: typeof EnumApplyPlugins;
    /**
     * @desc lifecycle stage
     */
    stage: ServiceStage;
    /**
     * @desc enum lifecycle
     */
    ServiceStage: typeof ServiceStage;
    /**
     * @desc App path
     */
    paths: IServicePaths;
    /**
     * @desc finally config
     */
    config: IConfig;
    /**
     * @desc extra command
     */
    args: any;
    /**
     * @desc dev onChange type
     */
    ConfigChangeType: typeof ConfigChangeType;
    constructor(opts: IServiceOptions);
    setStage(stage: ServiceStage): void;
    init(): Promise<void>;
    initPlugins(plugin: IPlugin): Promise<void>;
    getPluginAPI(opts: IPluginAPIOptions): PluginAPI;
    applyPlugins(pluginOptions: IApplyPlugins): Promise<any>;
    isPluginEnable(pluginId: string): boolean | void;
    loadEnv(): void;
    hasPlugins(pluginIds: string[]): boolean;
    resolvePackage(): any;
    run({ args, command }: IRun): Promise<void>;
    runCommand({ command, args }: IRun): void;
}
export {};
