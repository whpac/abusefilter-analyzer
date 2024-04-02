import { assert } from 'chai';
import { Tokenizer } from '../../src/parser/Tokenizer.js';
import { Parser } from '../../src/parser/Parser.js';
import { TreeNodeType } from '../../src/model/TreeNodeType.js';
import { AtomNode } from '../../src/parser/nodes/AtomNode.js';
import { TreeNodeFactory } from '../../src/parser/nodes/TreeNodeFactory.js';

describe('Parser tests', () => {
    describe('Simple expressions', () => {
        it('should parse a simple comparison', () => {
            const tokens = (new Tokenizer()).tokenize('a == b');
            const rootNode = (new Parser(new TreeNodeFactory())).parse(tokens);

            assert.isNotNull(rootNode);
            assert.equal(rootNode.type, TreeNodeType.CompareEqual);

            const rootNodeChildren = rootNode?.children;
            assert.isArray(rootNodeChildren);

            const leftOperand = rootNodeChildren[0] as AtomNode;
            assert.isTrue(leftOperand instanceof AtomNode);
            assert.equal(leftOperand.type, TreeNodeType.Atom);
            assert.equal(leftOperand.tokenValue, 'a');

            const rightOperand = rootNodeChildren[1] as AtomNode;
            assert.isTrue(rightOperand instanceof AtomNode);
            assert.equal(rightOperand.type, TreeNodeType.Atom);
            assert.equal(rightOperand.tokenValue, 'b');
        });

        it('should properly apply operator precendence in arithmetics', () => {
            const tokens = (new Tokenizer()).tokenize('3 + 4 * 5');
            const rootNode = (new Parser(new TreeNodeFactory())).parse(tokens);

            assert.isNotNull(rootNode);
            assert.equal(rootNode.type, TreeNodeType.ArithmeticAdd);
        });

        it('should properly apply parentheses', () => {
            const tokens = (new Tokenizer()).tokenize('1 * (2 + 3)');
            const rootNode = (new Parser(new TreeNodeFactory())).parse(tokens);

            assert.isNotNull(rootNode);
            assert.equal(rootNode.type, TreeNodeType.ArithmeticMultiply);
        });
    });
});