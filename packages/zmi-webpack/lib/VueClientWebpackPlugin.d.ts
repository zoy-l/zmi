import { Compiler, EntryNormalized } from 'webpack';
export default class VueClient {
    apply(compiler: Compiler): void;
    injectRefreshEntry(originalEntry: EntryNormalized): any;
}
