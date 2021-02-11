import { NodePath } from '@babel/traverse';
import { babelTypes } from '@zmi/utils';
export default function (): {
    visitor: {
        ImportDeclaration(content: NodePath<babelTypes.ImportDeclaration>): void;
    };
};
