import { IEvaluableTreeNode, OnValueSetCallback } from '../../model/nodes/IEvaluableTreeNode.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IToken } from '../../model/tokens/IToken.js';
import { IValue } from '../../model/value/IValue.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
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
        this.valueByContext.set(evaluationContext.rootContext, value);

        for(const callback of this.onValueSetCallbacks) {
            callback(this, evaluationContext);
        }
    }

    public getValue(evaluationContext: IEvaluationContext): IValue {
        return this.valueByContext.get(evaluationContext.rootContext) ?? Value.Null;
    }

    public hasValue(evaluationContext: IEvaluationContext): boolean {
        return this.valueByContext.has(evaluationContext.rootContext);
    }

    public getContextsWithValue(): IEvaluationContext[] {
        return Array.from(this.valueByContext.keys());
    }

    public addOnValueSetCallback(callback: OnValueSetCallback): void {
        this.onValueSetCallbacks.push(callback);
    }
}