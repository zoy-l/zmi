interface PrepareUrls {
    protocol?: string;
    pathname?: string;
    host: string;
    port: number;
}
export default function prepareUrls(opts: PrepareUrls): {
    lanUrlForConfig: any;
    lanUrlForTerminal: string | undefined;
    localUrlForTerminal: string;
    localUrlForBrowser: string;
};
export {};
