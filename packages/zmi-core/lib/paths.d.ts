import { IServicePaths } from './types';
import { IConfig } from './Service';
interface IServicePath {
    config: IConfig & {
        singular?: boolean;
        outputPath?: string;
    };
    env?: string;
    cwd: string;
}
export default function servicePath(options: IServicePath): IServicePaths;
export {};
