import { assert } from 'chai';
import { Tokenizer } from '../../src/parser/Tokenizer.js';
import { Parser } from '../../src/parser/Parser.js';
import { NodeEvaluator } from '../../src/evaluator/NodeEvaluator.js';
import { EvaluationContext } from '../../src/evaluator/EvaluationContext.js';
import { ValueDataType } from '../../src/model/ValueDataType.js';
import { EvaluableNodeFactory } from '../../src/evaluator/EvaluableNodeFactory.js';

describe('Evaluator tests', () => {
    describe('AND operator', () => {
        it('should evaluate true & true as true', async () => {
            const tokens = (new Tokenizer()).tokenize('true & true');
            const rootNode = (new Parser(new EvaluableNodeFactory())).parse(tokens);
            const evaluator = new NodeEvaluator();
            const context = new EvaluationContext();
            await evaluator.evaluateNode(rootNode, context);

            assert.isTrue(rootNode.hasValue(context));

            const value = rootNode.getValue(context);

            assert.equal(value.dataType, ValueDataType.Boolean);
            assert.equal(value.value, true);
        });

        it('should evaluate false & true as false', async () => {
            const tokens = (new Tokenizer()).tokenize('false & true');
            const rootNode = (new Parser(new EvaluableNodeFactory())).parse(tokens);
            const evaluator = new NodeEvaluator();
            const context = new EvaluationContext();
            await evaluator.evaluateNode(rootNode, context);

            assert.isTrue(rootNode.hasValue(context));

            const value = rootNode.getValue(context);

            assert.equal(value.dataType, ValueDataType.Boolean);
            assert.equal(value.value, false);
        });

        it('should evaluate false & false as false', async () => {
            const tokens = (new Tokenizer()).tokenize('false & false');
            const rootNode = (new Parser(new EvaluableNodeFactory())).parse(tokens);
            const evaluator = new NodeEvaluator();
            const context = new EvaluationContext();
            await evaluator.evaluateNode(rootNode, context);

            assert.isTrue(rootNode.hasValue(context));

            const value = rootNode.getValue(context);

            assert.equal(value.dataType, ValueDataType.Boolean);
            assert.equal(value.value, false);
        });

        it('should evaluate 0 & true as 0', async () => {
            const tokens = (new Tokenizer()).tokenize('0 & true');
            const rootNode = (new Parser(new EvaluableNodeFactory())).parse(tokens);
            const evaluator = new NodeEvaluator();
            const context = new EvaluationContext();
            await evaluator.evaluateNode(rootNode, context);

            assert.isTrue(rootNode.hasValue(context));

            const value = rootNode.getValue(context);

            assert.equal(value.dataType, ValueDataType.Integer);
            assert.equal(value.value, 0);
        });

        it('should evaluate true & 0 as false', async () => {
            const tokens = (new Tokenizer()).tokenize('true & 0');
            const rootNode = (new Parser(new EvaluableNodeFactory())).parse(tokens);
            const evaluator = new NodeEvaluator();
            const context = new EvaluationContext();
            await evaluator.evaluateNode(rootNode, context);

            assert.isTrue(rootNode.hasValue(context));

            const value = rootNode.getValue(context);

            assert.equal(value.dataType, ValueDataType.Boolean);
            assert.equal(value.value, false);
        });
    });
});