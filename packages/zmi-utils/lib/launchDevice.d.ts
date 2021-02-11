import yargsParser from 'yargs-parser';
export declare const defaultYargsOptions: {
    alias: {
        version: string[];
        help: string[];
    };
    boolean: string[];
};
declare const _default: (opts?: yargsParser.Options | undefined) => Promise<{
    args: yargsParser.Arguments;
    command: string;
}>;
export default _default;
