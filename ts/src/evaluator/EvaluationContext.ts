import { IEvaluationContext } from '../model/IEvaluationContext.js';
import { IValue } from '../model/value/IValue.js';
import { VariableValue } from './value/VariableValue.js';

export class EvaluationContext implements IEvaluationContext {
    public static readonly METADATA_LOG_ID = 'logId';
    public static readonly METADATA_LOG_DATE = 'logDate';

    /** The parent context, used for looking up variable values, will not be changed by this context. */
    protected readonly parentContext: EvaluationContext | null = null;

    /** Here our variables will be stored. */
    protected readonly variables: Map<string, IValue> = new Map();

    public readonly rootContext: IEvaluationContext;

    public readonly isSpeculative: boolean;

    private readonly _metadata: Map<string, unknown> = new Map();

    public get metadata(): Map<string, unknown> {
        // Maybe in future we will need to make a union of local and parent metadata,
        // but for now it's sufficient to return the parent's one.
        if (this.parentContext !== null) {
            return this.parentContext.metadata;
        }
        return this._metadata;
    }

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

    public createChildContext(): EvaluationContext {
        const childContext = new EvaluationContext(this);
        return childContext;
    }

    /**
     * Stores the ID of the abuse log entry associated with this context.
     * This may be useful to further direct the user to the page with details
     * of the log entry.
     * @param logId The log ID to set in the metadata.
     */
    public setLogId(logId: number): void {
        this._metadata.set(EvaluationContext.METADATA_LOG_ID, logId);
    }

    /**
     * Stores the date when the abuse log entry was created.
     * @param logDate The date of the log entry associated with this context.
     */
    public setLogDate(logDate: Date | string): void {
        if (typeof logDate === 'string') {
            logDate = new Date(logDate);
        }

        this._metadata.set(EvaluationContext.METADATA_LOG_DATE, logDate);
    }
}