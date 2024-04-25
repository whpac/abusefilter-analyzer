import { Value } from './Value.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { IVariableValue } from '../../model/value/IVariableValue.js';
import { IValue } from '../../model/value/IValue.js';

/**
 * Represents a variable value, that can be used as a l-value in assignments.
 */
export class VariableValue<TValue = unknown> extends Value<TValue> implements IVariableValue<TValue> {

    public readonly name: string;

    /** Is set to false only for uninitialized variables */
    private isInitialized: boolean = true;

    public override get value(): TValue {
        // TODO: Without the redundant check for name, apparently assigning to variables fails. Investigate it.
        if (!this.isInitialized && this.name !== undefined) {
            throw new Error(`Variable ${this.name} does not exist`);
        }
        return this._value;
    }

    public constructor(variableName: string, dataType: ValueDataType, value: TValue) {
        super(dataType, value);
        this.name = variableName;
    }

    /**
     * Creates a new variable from a Value object.
     * @param value The variable value
     * @param variableName The variable name
     */
    public static fromValue<T>(value: IValue<T>, variableName: string): VariableValue<T> {
        return new VariableValue(variableName, value.dataType, value.value);
    }

    /**
     * Creates a new uninitialized variable.
     * @param variableName The variable name
     */
    public static makeUninitialized(variableName: string): VariableValue<null> {
        const variable = new VariableValue(variableName, ValueDataType.Undefined, null);
        variable.isInitialized = false;
        return variable;
    }
}