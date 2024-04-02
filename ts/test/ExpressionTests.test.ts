import * as path from 'path';
import * as fs from 'fs';
import { Parser } from '../src/parser/Parser.js';
import { Tokenizer } from '../src/parser/Tokenizer.js';
import { EvaluatedTreeNode } from '../src/evaluator/EvaluatedTreeNode.js';
import { EvaluationContext } from '../src/evaluator/EvaluationContext.js';
import { NodeEvaluator } from '../src/evaluator/NodeEvaluator.js';
import { assert } from 'chai';
import { TreeNodeFactory } from '../src/parser/nodes/TreeNodeFactory.js';

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
                    const parser = new Parser(new TreeNodeFactory());
                    const tokens = tokenizer.tokenize(content);
                    const rootNode = parser.parse(tokens)!;
                    const evaluatedRootNode = new EvaluatedTreeNode(rootNode);
                    await evaluatedRootNode.evaluate(new EvaluationContext(), new NodeEvaluator());
    
                    assert.isTrue(evaluatedRootNode.wasEvaluated);
                    assert.isTrue(evaluatedRootNode.value.isTruthy());
                } catch(e) {
                    console.error((e as Error).toString());
                    throw e;
                }
            });
        }
    });
});