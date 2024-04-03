import { ITreeNode } from './model/ITreeNode.js';
import { Parser } from './parser/Parser.js';
import { Token } from './parser/Token.js';
import { Tokenizer } from './parser/Tokenizer.js';
import { TreeNodeFactory } from './parser/nodes/TreeNodeFactory.js';

export class AbuseFilter {
    protected readonly filterTokens: Token[];
    protected readonly filterTree: ITreeNode;

    public constructor(filterText: string) {
        const tokenizer: Tokenizer = new Tokenizer();
        const parser: Parser = new Parser(new TreeNodeFactory());

        this.filterTokens = tokenizer.tokenize(filterText);
        this.filterTree = parser.parse(this.filterTokens);
    }
}