import { AbuseFilterFunction, AbuseFilterFunctions } from './AbuseFilterFunctions.js';
import { Value } from './Value.js';
import { VariableValue } from './VariableValue.js';

export class EvaluationContext {
    /** The parent context, used for looking up variable values, will not be changed by this context. */
    protected parentContext: EvaluationContext | null = null;

    /** Here our variables will be stored. */
    protected variables: Map<string, Value> = new Map();

    /**
     * Returns the value of a variable. If the variable is not found in this context,
     * it will look up in its parent.
     * If the variable is not found in the parent, it will throw an error.
     * @param variableName A variable name to look up
     */
    public getVariable(variableName: string): VariableValue {
        // Variable names are case-insensitive in AbuseFilter
        variableName = variableName.toLowerCase();

        // First, look in our collection and if found return the value
        const localValue = this.variables.get(variableName);
        if (localValue != undefined) return VariableValue.fromValue(localValue, variableName);

        // If we don't have the variable, perhaps our parent has it
        if (this.parentContext !== null) {
            return this.parentContext.getVariable(variableName);
        }

        return VariableValue.fromUndefined(variableName);
    }

    /**
     * Sets the value of a variable. If the variable hasn't been declared in this context,
     * it's created and then set to the value.
     * Does not overwrite variables in the parent context.
     * @param variableName The variable name to set
     * @param newValue The new value of the variable
     */
    public setVariable(variableName: string, newValue: Value): void {
        // Variable names are case-insensitive in AbuseFilter
        variableName = variableName.toLowerCase();
        
        this.variables.set(variableName, newValue);
    }

    /**
     * Returns a function by its name. If the function is not found in this context,
     * it will look up in its parent.
     * If the function is not found in the parent, it will return `null`.
     * @param functionName A function name to look up
     */
    public getFunction(functionName: string): AbuseFilterFunction<unknown> {
        const func = AbuseFilterFunctions.getFunction(functionName);
        if (func !== undefined) return func;

        if (this.parentContext !== null) {
            return this.parentContext.getFunction(functionName);
        }

        throw new Error(`Function ${functionName} not found`);
    }

    /**
     * Creates a child context that can't change data stored in its parent.
     * Used for speculative execution not to leak its results to the rest of
     * the code.
     * @returns A new child context
     */
    public createChildContext(): EvaluationContext {
        const childContext = new EvaluationContext();
        childContext.parentContext = this;
        return childContext;
    }
}