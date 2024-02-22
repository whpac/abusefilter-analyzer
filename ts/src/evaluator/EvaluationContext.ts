import { Value } from './Value.js';

export class EvaluationContext {
    /** The parent context, used for looking up variable values, will not be changed by this context. */
    protected parentContext: EvaluationContext | null = null;

    /** Here our variables will be stored. */
    protected variables: Map<string, Value> = new Map();

    public getVariable(variableName: string): Value {
        // First, look in our collection and if found return the value
        const localValue = this.variables.get(variableName);
        if (localValue != undefined) return localValue;

        // If we don't have the variable, perhaps our parent has it
        if (this.parentContext !== null) {
            return this.parentContext.getVariable(variableName);
        }

        // The last resort, return null as the variable's value
        return Value.Null;
    }

    public setVariable(variableName: string, newValue: Value): void {
        this.variables.set(variableName, newValue);
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