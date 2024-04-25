import { IValue } from './value/IValue.js';
import { IVariableValue } from './value/IVariableValue.js';

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
     * Returns the value of a variable. If the variable is not found in this context,
     * it will look up in its parent.
     * If the variable is not found in the parent, it will throw an error.
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
     * Returns a function by its name. If the function is not found in this context,
     * it will look up in its parent.
     * If the function is not found in the parent, it will return `null`.
     * @param functionName A function name to look up
     */
    getFunction(functionName: string): AbuseFilterFunction<unknown>;

    /**
     * Creates a child context that can't change data stored in its parent.
     * Used for speculative execution not to leak its results to the rest of
     * the code.
     */
    createChildContext(): IEvaluationContext;
}

export type AbuseFilterFunction<T> = (context: IEvaluationContext, args: IValue[]) => Promise<IValue<T>>;