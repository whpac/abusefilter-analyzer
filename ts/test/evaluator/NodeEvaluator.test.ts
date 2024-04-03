import { assert } from 'chai';
import { Tokenizer } from '../../src/parser/Tokenizer.js';
import { Parser } from '../../src/parser/Parser.js';
import { EvaluatedTreeNode } from '../../src/evaluator/EvaluatedTreeNode.js';
import { NodeEvaluator } from '../../src/evaluator/NodeEvaluator.js';
import { EvaluationContext } from '../../src/evaluator/EvaluationContext.js';
import { ValueDataType } from '../../src/model/ValueDataType.js';
import { TreeNodeFactory } from '../../src/parser/nodes/TreeNodeFactory.js';

describe('Evaluator tests', () => {
    describe('AND operator', () => {
        it('should evaluate true & true as true', async () => {
            const tokens = (new Tokenizer()).tokenize('true & true');
            const rootNode = (new Parser(new TreeNodeFactory())).parse(tokens)!;
            const evaluatedRootNode = new EvaluatedTreeNode(rootNode);
            await evaluatedRootNode.evaluate(new EvaluationContext(), new NodeEvaluator());

            assert.isTrue(evaluatedRootNode.wasEvaluated);

            const value = evaluatedRootNode.value;

            assert.equal(value.dataType, ValueDataType.Boolean);
            assert.equal(value.value, true);
        });

        it('should evaluate false & true as false', async () => {
            const tokens = (new Tokenizer()).tokenize('false & true');
            const rootNode = (new Parser(new TreeNodeFactory())).parse(tokens)!;
            const evaluatedRootNode = new EvaluatedTreeNode(rootNode);
            await evaluatedRootNode.evaluate(new EvaluationContext(), new NodeEvaluator());

            assert.isTrue(evaluatedRootNode.wasEvaluated);

            const value = evaluatedRootNode.value;

            assert.equal(value.dataType, ValueDataType.Boolean);
            assert.equal(value.value, false);
        });

        it('should evaluate false & false as false', async () => {
            const tokens = (new Tokenizer()).tokenize('false & false');
            const rootNode = (new Parser(new TreeNodeFactory())).parse(tokens)!;
            const evaluatedRootNode = new EvaluatedTreeNode(rootNode);
            await evaluatedRootNode.evaluate(new EvaluationContext(), new NodeEvaluator());

            assert.isTrue(evaluatedRootNode.wasEvaluated);

            const value = evaluatedRootNode.value;

            assert.equal(value.dataType, ValueDataType.Boolean);
            assert.equal(value.value, false);
        });

        it('should evaluate 0 & true as 0', async () => {
            const tokens = (new Tokenizer()).tokenize('0 & true');
            const rootNode = (new Parser(new TreeNodeFactory())).parse(tokens)!;
            const evaluatedRootNode = new EvaluatedTreeNode(rootNode);
            await evaluatedRootNode.evaluate(new EvaluationContext(), new NodeEvaluator());

            assert.isTrue(evaluatedRootNode.wasEvaluated);

            const value = evaluatedRootNode.value;

            assert.equal(value.dataType, ValueDataType.Integer);
            assert.equal(value.value, 0);
        });

        it('should evaluate true & 0 as false', async () => {
            const tokens = (new Tokenizer()).tokenize('true & 0');
            const rootNode = (new Parser(new TreeNodeFactory())).parse(tokens)!;
            const evaluatedRootNode = new EvaluatedTreeNode(rootNode);
            await evaluatedRootNode.evaluate(new EvaluationContext(), new NodeEvaluator());

            assert.isTrue(evaluatedRootNode.wasEvaluated);

            const value = evaluatedRootNode.value;

            assert.equal(value.dataType, ValueDataType.Boolean);
            assert.equal(value.value, false);
        });
    });
});