import { IEvaluableTreeNode, OnValueSetCallback } from '../../model/nodes/IEvaluableTreeNode.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IToken } from '../../model/tokens/IToken.js';
import { IValue } from '../../model/value/IValue.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { Value } from '../value/Value.js';

/**
 * Represents a node in the abstract syntax tree that can store
 * values and errors from evaluations. The node can be evaluated
 * more than once with different contexts; it can store multiple
 * sets of values and errors.
 */
export class EvaluableTreeNode implements IEvaluableTreeNode {

    public readonly type: TreeNodeType;

    public readonly identity: IToken;

    public readonly children: readonly IEvaluableTreeNode[];

    /** Holds all the values from evaluations of this node */
    private readonly valueByContext: Map<IEvaluationContext, IValue> = new Map();

    private readonly onValueSetCallbacks: OnValueSetCallback[] = [];

    /** Holds all the errors from evaluations of this node */
    private readonly errorsByContext: Map<IEvaluationContext, Error[]> = new Map();

    private readonly onErrorCallbacks: OnValueSetCallback[] = [];

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
        return this.valueByContext.get(evaluationContext.rootContext) ?? Value.Undefined;
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

    public setError(evaluationContext: IEvaluationContext, error: Error): void {
        const errors = this.errorsByContext.get(evaluationContext) ?? [];
        errors.push(error);
        this.errorsByContext.set(evaluationContext, errors);

        for(const callback of this.onErrorCallbacks) {
            callback(this, evaluationContext);
        }
    }

    public getErrors(evaluationContext: IEvaluationContext): Error[] {
        return this.errorsByContext.get(evaluationContext) ?? [];
    }

    public hasErrors(evaluationContext: IEvaluationContext): boolean {
        return this.errorsByContext.has(evaluationContext);
    }

    public getContextsWithErrors(): IEvaluationContext[] {
        return Array.from(this.errorsByContext.keys());
    }

    public addOnErrorCallback(callback: OnValueSetCallback): void {
        this.onErrorCallbacks.push(callback);
    }
}