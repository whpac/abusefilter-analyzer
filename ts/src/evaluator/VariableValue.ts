import { Value } from './Value.js';
import { ValueDataType } from './ValueDataType.js';

export class VariableValue<TValue = unknown> extends Value<TValue> {

    public readonly name: string;

    public constructor(dataType: ValueDataType, value: TValue, variableName: string) {
        super(dataType, value);
        this.name = variableName;
    }

    public static fromValue<T>(value: Value<T>, variableName: string): VariableValue<T> {
        return new VariableValue(value.dataType, value.value, variableName);
    }
}