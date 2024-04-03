import * as path from 'path';
import * as fs from 'fs';
import { Parser } from '../src/parser/Parser.js';
import { Tokenizer } from '../src/parser/Tokenizer.js';
import { EvaluationContext } from '../src/evaluator/EvaluationContext.js';
import { NodeEvaluator } from '../src/evaluator/NodeEvaluator.js';
import { assert } from 'chai';
import { EvaluableNodeFactory } from '../src/evaluator/nodes/EvaluableNodeFactory.js';

describe('Expressions from .t files', () => {
    // Read files with .t extension from the /parserTests folder
    // And treat the content of every file as an expression that should be truthy

    const testFolder = 'parserTests';

    fs.readdirSync(testFolder).forEach((file: string) => {
        if (path.extname(file) === '.t') {
            it(file, async () => {
                try {
                    const content = fs.readFileSync(path.join(testFolder, file), 'utf8');
                    const tokenizer = new Tokenizer();
                    const parser = new Parser(new EvaluableNodeFactory());
                    const tokens = tokenizer.tokenize(content);
                    const rootNode = parser.parse(tokens);
                    const evaluator = new NodeEvaluator();
                    const context = new EvaluationContext();
                    const value = await evaluator.evaluateNode(rootNode, context);
    
                    assert.isTrue(rootNode.hasValue(context));
                    assert.isTrue(rootNode.getValue(context) === value);
                    assert.isTrue(value.isTruthy());
                } catch(e) {
                    console.error((e as Error).toString());
                    throw e;
                }
            });
        }
    });
});