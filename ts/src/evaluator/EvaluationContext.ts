import { AbuseFilterFunction, IEvaluationContext } from '../model/IEvaluationContext.js';
import { IValue } from '../model/IValue.js';
import { AbuseFilterFunctions } from './AbuseFilterFunctions.js';
import { VariableValue } from './VariableValue.js';

export class EvaluationContext implements IEvaluationContext {
    /** The parent context, used for looking up variable values, will not be changed by this context. */
    protected parentContext: EvaluationContext | null = null;

    /** Here our variables will be stored. */
    protected variables: Map<string, IValue> = new Map();

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

    public setVariable(variableName: string, newValue: IValue): void {
        // Variable names are case-insensitive in AbuseFilter
        variableName = variableName.toLowerCase();
        
        this.variables.set(variableName, newValue);
    }

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