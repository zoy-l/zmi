export default class BabelRegister {
    only: Record<string, string[]>;
    setOnlyMap({ key, value }: {
        key: string;
        value: string[];
    }): void;
    register(): void;
}
