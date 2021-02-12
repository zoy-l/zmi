import { NodePath } from '@babel/traverse';
import { babelTypes } from '@zmi-cli/utils';
export default function (): {
    visitor: {
        ImportDeclaration(content: NodePath<babelTypes.ImportDeclaration>): void;
    };
};
