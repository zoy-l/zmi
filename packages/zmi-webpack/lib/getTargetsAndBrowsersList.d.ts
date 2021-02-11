interface IOpts {
    config: any;
}
export default function ({ config }: IOpts): {
    targets: Record<string, any>;
    browserslist: any;
};
export {};
