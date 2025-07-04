import { IValue } from './value/IValue.js';
import { IVariableValue } from './value/IVariableValue.js';

/**
 * Evaluation context is an object that represents an outer world state during
 * the filter evaluation. It's responsible for introducing and storing variables,
 * as well as provides a means of guarding results of speculative execution from
 * leaking into the true evaluation path.
 * 
 * Evaluation context can form a hierarchy, where the original one is considered
 * a root and contexts can cave their children. All changes made in the child
 * context should not propagate upwards in the tree.
 */
export interface IEvaluationContext {

    /**
     * Returns the root context of this context. The root context is the one
     * that doesn't have a parent and is the topmost context in the hierarchy.
     * For the root context, this method should be equal to `this`.
     */
    get rootContext(): IEvaluationContext;

    /**
     * Allows to check whether execution in this context is speculative.
     */
    get isSpeculative(): boolean;

    /**
     * Returns any optional metadata that can be associated with this context.
     * Implementations can store here any additional information that can be useful
     * to determine e.g. the source of data.
     * 
     * It is up to the implementation to decide what pieces of information are
     * inherited from the parent context and what are not.
     */
    get metadata(): Map<string, unknown>;

    /**
     * Returns the value of a variable. If the variable is not found in this context,
     * it will look up in its parent.
     * If the variable is not found in the parent, a null value will be returned.
     * @param variableName A variable name to look up
     */
    getVariable(variableName: string): IVariableValue;

    /**
     * Sets the value of a variable. If the variable hasn't been declared in this context,
     * it's created and then set to the value.
     * Does not overwrite variables in the parent context.
     * @param variableName The variable name to set
     * @param newValue The new value of the variable
     */
    setVariable(variableName: string, newValue: IValue): void;

    /**
     * Creates a child context that can't change data stored in its parent.
     * Used for speculative execution not to leak its results to the rest of
     * the code.
     */
    createChildContext(): IEvaluationContext;

    /**
     * Checks whether this evaluation context is equivalent to another one.
     * Two contexts are considered equivalent if they have the same root context.
     * @param other Another evaluation context to compare with.
     * @returns Returns true if the contexts are equivalent.
     */
    isEquivalentTo(other: IEvaluationContext): boolean;
}
