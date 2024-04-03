import { EvaluationContext } from './evaluator/EvaluationContext.js';
import { NodeEvaluator } from './evaluator/NodeEvaluator.js';
import { EvaluableNodeFactory } from './evaluator/nodes/EvaluableNodeFactory.js';
import { IEvaluationContext } from './model/IEvaluationContext.js';
import { IEvaluableTreeNode } from './model/nodes/IEvaluableTreeNode.js';
import { IValue } from './model/value/IValue.js';
import { Parser } from './parser/Parser.js';
import { Token } from './parser/Token.js';
import { Tokenizer } from './parser/Tokenizer.js';

export class AbuseFilter {
    public readonly tokens: readonly Token[];
    public readonly rootNode: IEvaluableTreeNode;

    protected defaultContext: IEvaluationContext;

    public constructor(filterText: string) {
        const tokenizer = new Tokenizer();
        const parser = new Parser(new EvaluableNodeFactory());

        this.tokens = tokenizer.tokenize(filterText);
        this.rootNode = parser.parse(this.tokens);

        this.defaultContext = new EvaluationContext();
    }

    public async evaluate(context?: IEvaluationContext): Promise<IValue> {
        const evaluator = new NodeEvaluator();
        context ??= this.defaultContext;
        return await evaluator.evaluateNode(this.rootNode, context);
    }

    public walkTree(callback: TreeWalkerCallback, context?: IEvaluationContext): void {
        this.walkTreeInner(this.rootNode, 0, callback, context);
    }

    protected walkTreeInner(node: IEvaluableTreeNode, currentDepth: number, callback: TreeWalkerCallback, context?: IEvaluationContext): void {
        context ??= this.defaultContext;
        const value = node.getValue(context);
        callback(node, value, currentDepth);
        for(const child of node.children) {
            this.walkTreeInner(child, currentDepth + 1, callback, context);
        }
    }
}

type TreeWalkerCallback = (node: IEvaluableTreeNode, value: IValue, depth: number) => void;