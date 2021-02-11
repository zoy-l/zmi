import { IOpts, IGetContentArgs, IScript } from './types';
import { IConfig } from './Service';
declare class Html {
    /**
     * @desc user config
     */
    config: IConfig;
    /**
     * @desc Template path
     */
    tplPath?: string;
    constructor(opts: IOpts);
    getHtmlPath(path: string): string;
    getRelPathToPublicPath(path: string): string;
    getAsset(opts: {
        file: string;
        path?: string;
    }): string;
    getScriptsContent(scripts: IScript[]): string;
    getContent(args: IGetContentArgs): Promise<string>;
}
export default Html;
