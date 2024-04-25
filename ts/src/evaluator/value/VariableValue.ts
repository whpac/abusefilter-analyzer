import { Value } from './Value.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { IVariableValue } from '../../model/value/IVariableValue.js';
import { IValue } from '../../model/value/IValue.js';

/**
 * Represents a variable value, that can be used as a l-value in assignments.
 */
export class VariableValue<TValue = unknown> extends Value<TValue> implements IVariableValue<TValue> {

    public readonly name: string;

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
        return new VariableValue(variableName, ValueDataType.Null, null);
    }
}