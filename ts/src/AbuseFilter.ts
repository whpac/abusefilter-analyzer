import { EvaluableNodeFactory } from './evaluator/EvaluableNodeFactory.js';
import { IEvaluableTreeNode } from './model/IEvaluableTreeNode.js';
import { Parser } from './parser/Parser.js';
import { Token } from './parser/Token.js';
import { Tokenizer } from './parser/Tokenizer.js';

export class AbuseFilter {
    public readonly tokens: readonly Token[];
    protected readonly filterTree: IEvaluableTreeNode;

    public constructor(filterText: string) {
        const tokenizer = new Tokenizer();
        const parser = new Parser(new EvaluableNodeFactory());

        this.tokens = tokenizer.tokenize(filterText);
        this.filterTree = parser.parse(this.tokens);
    }
}