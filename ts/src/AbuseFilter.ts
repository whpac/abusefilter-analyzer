import { EvaluationContext } from './evaluator/EvaluationContext.js';
import { NodeEvaluator } from './evaluator/NodeEvaluator.js';
import { IFunctionExecutor } from './evaluator/functions/IFuctionExecutor.js';
import { EvaluableNodeFactory } from './evaluator/nodes/EvaluableNodeFactory.js';
import { Value } from './evaluator/value/Value.js';
import { AbuseFilterGUI } from './gui/AbuseFilterGUI.js';
import { AbuseFilterApi, AbuseLogEntry } from './mediawiki/AbuseFilterApi.js';
import { IEvaluationContext } from './model/IEvaluationContext.js';
import { IEvaluableTreeNode } from './model/nodes/IEvaluableTreeNode.js';
import { IValue } from './model/value/IValue.js';
import { Parser } from './parser/Parser.js';
import { Token } from './parser/Token.js';
import { Tokenizer } from './parser/Tokenizer.js';
import { FlattenAssociativeOpsTransformer } from './transform/FlattenAssociativeOpsTransformer.js';
import { ITreeTransformer } from './transform/ITreeTransformer.js';

export class AbuseFilter {
    public readonly tokens: readonly Token[];
    public readonly defaultContext: IEvaluationContext;
    public functionExecutor: IFunctionExecutor | undefined;

    protected rootNode: IEvaluableTreeNode;
    protected nodeFactory: EvaluableNodeFactory;

    public constructor(filterText: string) {
        this.nodeFactory = new EvaluableNodeFactory();
        const tokenizer = new Tokenizer();
        const parser = new Parser(this.nodeFactory);

        this.tokens = tokenizer.tokenize(filterText);
        this.rootNode = parser.parse(this.tokens);

        this.defaultContext = new EvaluationContext();
    }

    public async evaluate(): Promise<IValue> {
        const evaluator = new NodeEvaluator(this.functionExecutor);
        const context = this.defaultContext;
        return await evaluator.evaluateNode(this.rootNode, context);
    }

    public getRootNode(): IEvaluableTreeNode {
        return this.rootNode;
    }

    public transformWith(transformer: ITreeTransformer): void {
        this.rootNode = transformer.transform(this.rootNode, this.nodeFactory);
    }

    public walkTree(callback: TreeWalkerCallback): void {
        this.walkTreeInner(this.rootNode, 0, callback, this.defaultContext);
    }

    protected walkTreeInner(node: IEvaluableTreeNode, currentDepth: number, callback: TreeWalkerCallback, context: IEvaluationContext): void {
        const value = node.getValue(context);
        callback(node, value, currentDepth);
        for(const child of node.children) {
            this.walkTreeInner(child, currentDepth + 1, callback, context);
        }
    }

    public flattenAssociativeOperators(): void {
        const transformer = new FlattenAssociativeOpsTransformer();
        this.transformWith(transformer);
    }

    public renderInto(container: HTMLElement): void {
        const gui = new AbuseFilterGUI(container);
        gui.renderSyntaxTree(this.rootNode, this.defaultContext);
    }

    public setVariable(name: string, value: unknown): void {
        this.defaultContext.setVariable(name, Value.fromNative(value));
    }

    public loadVariablesFromLogEntry(logEntry: AbuseLogEntry): void {
        const variables = logEntry.details;
        for (const [key, value] of Object.entries(variables)) {
            this.setVariable(key, value);
        }
    }

    public static async createFromFilterId(filterId: number): Promise<AbuseFilter> {
        const filterText = await AbuseFilterApi.fetchAbuseFilterText(filterId);
        return new AbuseFilter(filterText);
    }

    public static async createFromLogId(logId: number | string): Promise<AbuseFilter> {
        const logEntry = await AbuseFilterApi.fetchAbuseLogEntry(logId);
        const filter = await AbuseFilter.createFromFilterId(logEntry.filter_id);
        filter.loadVariablesFromLogEntry(logEntry);
        return filter;
    }
}

type TreeWalkerCallback = (node: IEvaluableTreeNode, value: IValue, depth: number) => void;