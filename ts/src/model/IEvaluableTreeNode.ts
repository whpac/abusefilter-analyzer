import { IEvaluationContext } from './IEvaluationContext.js';
import { ITreeNode } from './ITreeNode.js';
import { IValue } from './IValue.js';

/**
 * Evaluable tree node is a type of tree node that can store the values produced by
 * the operators and functions in the tree. This is useful for calculation of the
 * filter result. These nodes can store multiple values, e.g. for different sets
 * of variables specified in the same filter.
 */
export interface IEvaluableTreeNode extends ITreeNode {

    get children(): readonly IEvaluableTreeNode[];

    /**
     * Registers a value of this tree node obtained in a specified context. Values from
     * different contexts are not overwritten and can be stored at the same time.
     * 
     * @param evaluationContext The context that was used to evaluate this tree node
     * @param value The value obtained from the evaluation
     */
    setValue(evaluationContext: IEvaluationContext, value: IValue): void;

    /**
     * Returns a value of this tree node obtained in a specified context. If the value
     * is not available, it will return a null IValue.
     * 
     * @param evaluationContext The context for which to obtain the value of this node
     */
    getValue(evaluationContext: IEvaluationContext): IValue;

    /**
     * Returns whether the value of this node is set in the specified context.
     * 
     * @param evaluationContext The context to check for the value
     */
    hasValue(evaluationContext: IEvaluationContext): boolean;

    /** Returns a list of evaluation contexts that have a value set. */
    getContextsWithValue(): IEvaluationContext[];

    /**
     * Adds a callback that will be called when the value of this node is set.
     * The callback can be fired many times if the value is set multiple times,
     * either within the same or different contexts.
     * 
     * @param callback The callback to be called when the value is set
     */
    addOnValueSetCallback(callback: OnValueSetCallback): void;
}

export type OnValueSetCallback = (node: IEvaluableTreeNode, evaluationContext: IEvaluationContext) => void;