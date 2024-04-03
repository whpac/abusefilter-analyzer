import { EvaluationContext } from './evaluator/EvaluationContext.js';
import { NodeEvaluator } from './evaluator/NodeEvaluator.js';
import { EvaluableNodeFactory } from './evaluator/nodes/EvaluableNodeFactory.js';
import { IEvaluableTreeNode } from './model/nodes/IEvaluableTreeNode.js';
import { IValue } from './model/value/IValue.js';
import { Parser } from './parser/Parser.js';
import { Token } from './parser/Token.js';
import { Tokenizer } from './parser/Tokenizer.js';

export class AbuseFilter {
    public readonly tokens: readonly Token[];
    public readonly rootNode: IEvaluableTreeNode;

    public constructor(filterText: string) {
        const tokenizer = new Tokenizer();
        const parser = new Parser(new EvaluableNodeFactory());

        this.tokens = tokenizer.tokenize(filterText);
        this.rootNode = parser.parse(this.tokens);
    }

    public async evaluate(): Promise<IValue> {
        const evaluator = new NodeEvaluator();
        const context = new EvaluationContext();
        return await evaluator.evaluateNode(this.rootNode, context);
    }
}