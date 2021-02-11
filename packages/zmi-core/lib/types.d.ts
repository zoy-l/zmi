import Joi from 'joi';
import { IConfig } from './Service';
export declare enum ServiceStage {
    uninitialized = 0,
    init = 1,
    initPlugins = 2,
    initHooks = 3,
    pluginReady = 4,
    getConfig = 5,
    getPaths = 6,
    run = 7
}
export declare enum EnumApplyPlugins {
    add = "add",
    modify = "modify",
    event = "event"
}
export declare enum EnumEnableBy {
    register = "register",
    config = "config"
}
export interface IDep {
    [name: string]: string;
}
export declare enum ConfigChangeType {
    reload = "reload"
}
export interface IChanged {
    key: string;
    pluginId: string;
}
export interface IPackage {
    name?: string;
    dependencies?: IDep;
    devDependencies?: IDep;
    [key: string]: any;
}
export interface IPluginConfig {
    default?: any;
    schema?: {
        (joi: Joi.Root): Joi.Schema;
    };
    onChange?: string | {
        (): void;
    };
}
export interface IPlugin {
    id: string;
    key: string;
    path: string;
    apply: () => any;
    config?: IPluginConfig;
    isPreset?: boolean;
    enableBy?: EnumEnableBy | (() => void);
}
export interface IHook {
    key: string;
    fn: (args?: {
        args: any;
    }, option?: any) => Promise<any> | void;
    pluginId?: string;
    before?: string;
    stage?: number;
}
export interface ICommand {
    name: string;
    alias?: string;
    description?: string;
    details?: string;
    fn: {
        ({ args }: {
            args: any;
        }): void;
    };
}
export declare type IServicePathKeys = 'cwd' | 'appNodeModulesPath' | 'appOutputPath' | 'appSrcPath' | 'appPagesPath';
export declare type IServicePaths = {
    [key in IServicePathKeys]: string;
};
export interface IHTMLTag {
    [key: string]: string;
}
export interface IModifyHTML {
    (memo: any, args?: any): Promise<any>;
}
export interface IAddHTML<T> {
    (memo: T): Promise<T>;
}
export interface IScript extends Partial<HTMLScriptElement> {
    content?: string;
}
export interface IStyle extends Partial<HTMLStyleElement> {
    content: string;
}
export declare type IScriptConfig = Array<IScript | string>;
export declare type IStyleConfig = Array<IStyle | string>;
export interface IOpts {
    config: IConfig;
    tplPath?: string;
    addHTMLHeadScripts?: IAddHTML<IHTMLTag[]>;
    addHTMLScripts?: IAddHTML<IHTMLTag[]>;
    addHTMLMetas?: IAddHTML<IHTMLTag[]>;
    addHTMLLinks?: IAddHTML<Partial<HTMLLinkElement>[]>;
    addHTMLStyles?: IAddHTML<Partial<IStyle>[]>;
    modifyHTML?: IModifyHTML;
}
export interface ILink {
    [key: string]: string;
}
export interface IHtmlConfig {
    metas?: IHTMLTag[];
    links?: Partial<HTMLLinkElement>[];
    styles?: Partial<IStyle>[];
    headScripts?: IHTMLTag[];
    scripts?: IHTMLTag[];
}
export interface IGetContentArgs extends IHtmlConfig {
    headJSFiles?: string[];
    jsFiles?: string[];
    cssFiles?: string[];
    tplPath?: string;
    modifyHTML?: IModifyHTML;
}
