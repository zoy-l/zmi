import { IApi } from '@zmi-cli/types';
export declare function chunksToFiles(opts: {
    htmlChunks: (string | Record<string, unknown>)[];
    chunks?: any[];
    noChunk?: boolean;
}): any;
export declare function getHtmlGenerator({ api }: {
    api: IApi;
}): any;
