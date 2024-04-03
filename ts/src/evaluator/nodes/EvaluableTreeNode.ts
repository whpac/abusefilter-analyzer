import { IEvaluableTreeNode, OnValueSetCallback } from '../../model/IEvaluableTreeNode.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IToken } from '../../model/IToken.js';
import { IValue } from '../../model/IValue.js';
import { TreeNodeType } from '../../model/TreeNodeType.js';
import { Value } from '../value/Value.js';

export class EvaluableTreeNode implements IEvaluableTreeNode {

    public readonly type: TreeNodeType;

    public readonly identity: IToken;

    public readonly children: readonly IEvaluableTreeNode[];

    /** Holds all the values from evaluations of this node */
    private readonly valueByContext: Map<IEvaluationContext, IValue> = new Map();

    private readonly onValueSetCallbacks: OnValueSetCallback[] = [];

    public constructor(type: TreeNodeType, identity: IToken, children: IEvaluableTreeNode[] = []) {
        this.type = type;
        this.identity = identity;
        this.children = children;
    }

    public setValue(evaluationContext: IEvaluationContext, value: IValue): void {
        this.valueByContext.set(evaluationContext, value);

        for(const callback of this.onValueSetCallbacks) {
            callback(this, evaluationContext);
        }
    }

    public getValue(evaluationContext: IEvaluationContext): IValue {
        return this.valueByContext.get(evaluationContext) ?? Value.Null;
    }

    public hasValue(evaluationContext: IEvaluationContext): boolean {
        return this.valueByContext.has(evaluationContext);
    }

    public getContextsWithValue(): IEvaluationContext[] {
        return Array.from(this.valueByContext.keys());
    }

    public addOnValueSetCallback(callback: OnValueSetCallback): void {
        this.onValueSetCallbacks.push(callback);
    }

    /**
     * Returns a string representation of the node and its children, suitable for debugging.
     */
    public toDebugString(): string {
        return this.toDebugStringInner().join('\n');
    }

    protected toDebugStringInner(): string[] {
        let lines = [ `${this.type.toString()}(${this.identity.type} ${this.identity.value})` ];
        for (const subnode of this.children) {
            if(!(subnode instanceof EvaluableTreeNode)) {
                lines.push('  ' + subnode.toString());
                continue;
            }

            // Align sublines to the right
            const sublines = subnode.toDebugStringInner().map(
                (line: string) => '  ' + line
            );

            lines = lines.concat(sublines);
        }

        return lines;
    }
}