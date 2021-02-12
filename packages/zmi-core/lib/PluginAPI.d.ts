/// <reference types="yargs-parser" />
import * as utils from '@zmi-cli/utils';
import { ICommand, IHook, IPluginConfig, EnumEnableBy } from './types';
import Service from './Service';
import Html from './Html';
export interface IPluginAPIOptions {
    id: string;
    key: string;
    service: Service;
}
interface IDescribe {
    id?: string;
    key?: string;
    config?: IPluginConfig;
    enableBy?: EnumEnableBy | (() => boolean);
}
interface IRegisterMethod {
    name: string;
    fn?: (args: utils.yargsParser.Arguments) => void;
    exitsError?: boolean;
}
export default class PluginAPI {
    /**
     * @desc Service class this
     */
    service: Service;
    /**
     * @desc plugin di
     */
    id: string;
    /**
     * @desc plugin key
     */
    key: string;
    /**
     * @desc utils
     */
    utils: typeof utils;
    /**
     * @desc Html generated
     */
    Html: typeof Html;
    constructor(options: IPluginAPIOptions);
    describe({ id, key, config, enableBy }?: IDescribe): void;
    registerCommand(command: ICommand): void;
    registerMethod(options: IRegisterMethod): void;
    register(hook: IHook): void;
    skipPlugins(pluginIds: string[]): void;
}
export {};
