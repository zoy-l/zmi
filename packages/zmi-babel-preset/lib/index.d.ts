export interface Ioptions {
    typescript?: boolean;
    react?: Record<string, any>;
    debug?: boolean;
    env?: Record<string, any>;
    transformRuntime?: Record<string, any>;
    dynamicImportNode?: boolean;
    autoCSSModules?: boolean;
    modify?: <T>(value: T) => T;
}
export declare function toObject<T extends Record<string, any>>(obj: T | boolean): T | Partial<T>;
declare const _default: (_context: never, options: Ioptions) => {
    presets: (false | (string | {
        debug: boolean | undefined;
    })[] | (string | {
        allowNamespaces: boolean;
    })[] | undefined)[];
    plugins: (string | false | (string | {
        loose: boolean;
    })[] | (string | {
        legacy: boolean;
    })[] | (string | {
        proposal: string;
    })[] | (string | {
        version: any;
        absoluteRuntime: string;
        useESModules: boolean;
    })[] | undefined)[];
};
export default _default;
