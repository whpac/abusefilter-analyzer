import { assert } from 'chai';
import { Tokenizer } from '../../src/parser/Tokenizer.js';
import { Parser } from '../../src/parser/Parser.js';
import { TreeNodeType } from '../../src/model/TreeNodeType.js';
import { TreeNodeFactory } from '../../src/parser/nodes/TreeNodeFactory.js';

describe('Parser tests', () => {
    describe('Simple expressions', () => {
        it('should parse a simple comparison', () => {
            const tokens = (new Tokenizer()).tokenize('a == b');
            const rootNode = (new Parser(new TreeNodeFactory())).parse(tokens);

            assert.isNotNull(rootNode);
            assert.equal(rootNode.type, TreeNodeType.Operator);
            assert.equal(rootNode.identity.value, '==');

            const rootNodeChildren = rootNode?.children;
            assert.isArray(rootNodeChildren);

            const leftOperand = rootNodeChildren[0];
            assert.equal(leftOperand.type, TreeNodeType.Atom);
            assert.equal(leftOperand.identity.value, 'a');

            const rightOperand = rootNodeChildren[1];
            assert.equal(rightOperand.type, TreeNodeType.Atom);
            assert.equal(rightOperand.identity.value, 'b');
        });

        it('should properly apply operator precendence in arithmetics', () => {
            const tokens = (new Tokenizer()).tokenize('3 + 4 * 5');
            const rootNode = (new Parser(new TreeNodeFactory())).parse(tokens);

            assert.isNotNull(rootNode);
            assert.equal(rootNode.type, TreeNodeType.Operator);
            assert.equal(rootNode.identity.value, '+');
        });

        it('should properly apply parentheses', () => {
            const tokens = (new Tokenizer()).tokenize('1 * (2 + 3)');
            const rootNode = (new Parser(new TreeNodeFactory())).parse(tokens);

            assert.isNotNull(rootNode);
            assert.equal(rootNode.type, TreeNodeType.Operator);
            assert.equal(rootNode.identity.value, '*');
        });
    });
});