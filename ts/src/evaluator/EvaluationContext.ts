import { AbuseFilterFunction, IEvaluationContext } from '../model/IEvaluationContext.js';
import { IValue } from '../model/value/IValue.js';
import { AbuseFilterFunctions } from './AbuseFilterFunctions.js';
import { VariableValue } from './value/VariableValue.js';

export class EvaluationContext implements IEvaluationContext {
    /** The parent context, used for looking up variable values, will not be changed by this context. */
    protected readonly parentContext: EvaluationContext | null = null;

    /** Here our variables will be stored. */
    protected readonly variables: Map<string, IValue> = new Map();

    public readonly rootContext: IEvaluationContext;

    public readonly isSpeculative: boolean;

    /**
     * Creates a new evaluation context.
     * @param parentContext The parent context, if any. If not provided, this context will be the root context.
     */
    public constructor(parentContext: EvaluationContext | null = null) {
        if (parentContext !== null) {
            this.parentContext = parentContext;
            this.rootContext = parentContext.rootContext;
        } else {
            this.rootContext = this;
        }

        // We might want to have non-speculative children contexts in future
        // but for now only the root context is non-speculative
        this.isSpeculative = (parentContext !== null);
    }

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

        return VariableValue.makeUninitialized(variableName);
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

    public createChildContext(): EvaluationContext {
        const childContext = new EvaluationContext(this);
        return childContext;
    }
}