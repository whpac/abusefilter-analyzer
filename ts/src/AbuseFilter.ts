import { Parser } from './parser/Parser.js';
import { Token } from './parser/Token.js';
import { Tokenizer } from './parser/Tokenizer.js';
import { TreeNode } from './parser/nodes/TreeNode.js';
import { TreeNodeFactory } from './parser/nodes/TreeNodeFactory.js';

export class AbuseFilter {
    protected readonly filterTokens: Token[];
    protected readonly filterTree: TreeNode;

    public constructor(filterText: string) {
        const tokenizer: Tokenizer = new Tokenizer();
        const parser: Parser = new Parser(new TreeNodeFactory());

        this.filterTokens = tokenizer.tokenize(filterText);
        this.filterTree = parser.parse(this.filterTokens);
    }
}