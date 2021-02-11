export declare function getBabelOpts({ config, presetOpts, hot }: {
    config: any;
    presetOpts: Record<string, unknown>;
    hot: boolean;
}): {
    presets: any[];
    plugins: any[];
    sourceType: string;
    babelrc: boolean;
};
