import { assert } from 'chai';
import { Tokenizer } from '../../src/parser/Tokenizer.js';
import { Parser } from '../../src/parser/Parser.js';
import { TreeNodeType } from '../../src/parser/TreeNodeType.js';
import { TreeNode } from '../../src/parser/TreeNode.js';
import { Token } from '../../src/parser/Token.js';

describe('Parser tests', () => {
    describe('Simple expressions', () => {
        it('should parse a simple comparison', () => {
            const tokens = (new Tokenizer()).tokenize('a == b');
            const rootNode = (new Parser()).parse(tokens);


            assert.equal(rootNode?.type, TreeNodeType.Compare);

            const rootNodeChildren = rootNode?.children as (TreeNode | string | null)[];
            assert.isArray(rootNodeChildren);
            assert.equal(rootNodeChildren[0], '==');

            const leftOperand = rootNodeChildren[1] as TreeNode;
            assert.equal(leftOperand.type, TreeNodeType.Atom);
            assert.equal((leftOperand.children as Token).value, 'a');

            const rightOperand = rootNodeChildren[2] as TreeNode;
            assert.equal(rightOperand.type, TreeNodeType.Atom);
            assert.equal((rightOperand.children as Token).value, 'b');
        });

        it('should properly apply operator precendence in arithmetics', () => {
            const tokens = (new Tokenizer()).tokenize('3 + 4 * 5');
            const rootNode = (new Parser()).parse(tokens);

            assert.equal(rootNode?.type, TreeNodeType.ArithmeticAdditive);

            const rootNodeChildren = rootNode?.children as (TreeNode | string | null)[];
            assert.isArray(rootNodeChildren);
            assert.equal(rootNodeChildren[0], '+');
        });

        it('should properly apply parentheses', () => {
            const tokens = (new Tokenizer()).tokenize('1 * (2 + 3)');
            const rootNode = (new Parser()).parse(tokens);

            assert.equal(rootNode?.type, TreeNodeType.ArithmeticMultiplicative);

            const rootNodeChildren = rootNode?.children as (TreeNode | string | null)[];
            assert.isArray(rootNodeChildren);
            assert.equal(rootNodeChildren[0], '*');
        });
    });
});