import { TreeNode } from '../parser/nodes/TreeNode.js';
import { TreeNodeType } from '../model/TreeNodeType.js';
import { AtomNode } from '../parser/nodes/AtomNode.js';
import { Value } from './Value.js';
import { NodeEvaluator } from './NodeEvaluator.js';
import { EvaluationContext } from './EvaluationContext.js';
import { TokenType } from '../parser/TokenType.js';
import { ValueDataType } from './ValueDataType.js';

export class EvaluatedTreeNode {

    /** The original node of the tree */
    public readonly node: TreeNode;

    /** The children that will be used to compute this node's value */
    public readonly children: EvaluatedTreeNode[];

    /** The value of this node. Used for caching */
    private _value: Value;

    /** These functions will be called when the value of this node is ready */
    private onReadyCallbacks: ((node: EvaluatedTreeNode) => void)[] = [];

    public constructor(node: TreeNode) {
        this.node = node;
        this._value = Value.Undefined;
        this.children = node.children.map((child) => new EvaluatedTreeNode(child));
    }

    /** Whether the node was already evaluated. */
    public get wasEvaluated(): boolean {
        return this.value.dataType !== ValueDataType.Undefined;
    }

    /** The value of this node. If the node hasn't been evaluated yet, contains `Value.Undefined`. */
    public get value(): Value {
        return this._value;
    }

    /**
     * Evaluates this node and all its children if needed.
     * @param evaluationContext The context of evaluation, containing all the variables and functions.
     * @param evaluator The object used to calculate value of this node and its children
     */
    public async evaluate(evaluationContext: EvaluationContext, evaluator: NodeEvaluator): Promise<void> {
        // If the value is already computed, return it
        if (this.wasEvaluated) return;

        // Atoms store value literals and variable reads
        if (this.node.type === TreeNodeType.Atom) {
            const atomNode = this.node as AtomNode;
            if (atomNode.tokenType === TokenType.Identifier) {
                // Get variable value
                this._value = evaluationContext.getVariable(atomNode.tokenValue);
            } else {
                // Else, convert the literal into a value
                this._value = Value.fromTokenLiteral(atomNode.token);
            }
        } else {
            // Evaluate this node
            this._value = await evaluator.evaluateNodeLazily(this, evaluationContext);
        }

        this.notifyOnValueReady();
    }

    /**
     * Adds a callback to be called when the value of this node is ready.
     * @param callback The callback to be called.
     */
    public onValueReady(callback: (node: EvaluatedTreeNode) => void): void {
        this.onReadyCallbacks.push(callback);
        if (this.wasEvaluated) {
            callback(this);
        }
    }

    /**
     * Notifies all the callbacks that the value of this node is ready.
     */
    protected notifyOnValueReady(): void {
        for (const callback of this.onReadyCallbacks) {
            callback(this);
        }
    }
}