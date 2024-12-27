import { IValue } from '../../model/value/IValue.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { Value } from './Value.js';

export class ValueConverter {

    public static toBoolean(value: IValue): Value<boolean | null> {
        if (value.isUndefined) return Value.Undefined;
        return new Value(ValueDataType.Boolean, this.toBooleanInner(value));
    }

    public static toInt(value: IValue): Value<number | null> {
        if (value.isUndefined) return Value.Undefined;
        return new Value(ValueDataType.Integer, Math.floor(this.toFloatInner(value)));
    }

    public static toFloat(value: IValue): Value<number | null> {
        if (value.isUndefined) return Value.Undefined;
        return new Value(ValueDataType.Float, this.toFloatInner(value));
    }

    public static toString(value: IValue): Value<string | null> {
        if (value.isUndefined) return Value.Undefined;
        return new Value(ValueDataType.String, this.toStringInner(value));
    }

    public static toArray(value: IValue): Value<IValue[] | null> {
        if (value.isUndefined) return Value.Undefined;
        return new Value(ValueDataType.Array, this.toArrayInner(value));
    }

    /**
     * Checks if a defined value is truthy
     * @see https://www.php.net/manual/en/language.types.boolean.php#language.types.boolean.casting
     * @param value The value to check, cannot be undefined
     */
    private static toBooleanInner(value: IValue): boolean {
        if (value.dataType === ValueDataType.Boolean) {
            return value.value as boolean;
        }

        if (value.dataType === ValueDataType.Integer || value.dataType === ValueDataType.Float) {
            return (value.value !== 0);
        }

        if (value.dataType === ValueDataType.String) {
            return (value.value !== '0' && value.value !== '');
        }

        if (value.dataType === ValueDataType.Array) {
            return (value.value as unknown[]).length !== 0;
        }

        if (value.dataType === ValueDataType.Null) {
            return false;
        }

        return true;
    }

    /**
     * Converts a defined value to a number (suitable for integer or float)
     * @param value The value to convert, cannot be undefined
     */
    private static toFloatInner(value: IValue): number {
        switch (value.dataType) {
            case ValueDataType.Integer:
            case ValueDataType.Float:
                return value.value as number;
            case ValueDataType.Boolean:
                return value.value ? 1 : 0;
            case ValueDataType.Null:
                return 0;
            case ValueDataType.Array:
                return (value.value as Value[]).length;
            default:
                return parseFloat(this.toStringInner(value));
        }
    }

    /**
     * Converts a defined value to a string
     * @param value The value to convert, cannot be undefined
     */
    private static toStringInner(value: IValue): string {
        switch (value.dataType) {
            case ValueDataType.Array:
                return (value.value as Value[]).map(v => v.asString().value!).join('\n') + '\n';
            case ValueDataType.Boolean:
                return value.value ? '1' : ''; // Like PHP's strval()...
            case ValueDataType.Null:
                return '';
        }
        return '' + value.value;
    }

    /**
     * Converts a defined value to an array
     * @param value The value to convert, cannot be undefined
     */
    private static toArrayInner(value: IValue): IValue[] {
        if (value.dataType === ValueDataType.Array) {
            return value.value as Value[];
        }
        return [ value ];
    }
}