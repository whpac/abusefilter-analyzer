import { IValue } from '../../model/IValue.js';
import { ValueDataType } from '../../model/ValueDataType.js';
import { Value } from '../Value.js';

export class ValueComparer {

    /**
     * Checks if the values are strictly equal.
     * Strict equality requires the data types and values to be
     * exactly the same.
     */
    public static isStrictlyEqualTo(a: IValue, b: IValue): Value<boolean> {
        return new Value(ValueDataType.Boolean, ValueComparer.areEqual(a, b, true));
    }

    /**
     * Checks if the values are not strictly equal.
     */
    public static isStrictlyInequalTo(a: IValue, b: IValue): Value<boolean> {
        return new Value(ValueDataType.Boolean, !ValueComparer.areEqual(a, b, true));
    }

    /**
     * Checks if the values are loosely equal.
     * Loose equality allows for different data types to be equal
     */
    public static isLooselyEqualTo(a: IValue, b: IValue): Value<boolean> {
        return new Value(ValueDataType.Boolean, ValueComparer.areEqual(a, b, false));
    }

    /**
     * Checks if the values are not loosely equal.
     */
    public static isLooselyInequalTo(a: IValue, b: IValue): Value<boolean> {
        return new Value(ValueDataType.Boolean, !ValueComparer.areEqual(a, b, false));
    }

    /**
     * Checks if the first value is less than the second.
     */
    public static isLessThan(a: IValue, b: IValue): Value<boolean> {
        return new Value(ValueDataType.Boolean, ValueComparer.compare(a, b) == ComparisonResult.LessThan);
    }

    /**
     * Checks if the first value is less than or equal to the second.
     */
    public static isLessThanOrEqualTo(a: IValue, b: IValue): Value<boolean> {
        return new Value(ValueDataType.Boolean, ValueComparer.compare(a, b) != ComparisonResult.GreaterThan);
    }

    /**
     * Checks if the first value is greater than the second.
     */
    public static isGreaterThan(a: IValue, b: IValue): Value<boolean> {
        return new Value(ValueDataType.Boolean, ValueComparer.compare(a, b) == ComparisonResult.GreaterThan);
    }

    /**
     * Checks if the first value is greater than or equal to the second.
     */
    public static isGreaterThanOrEqualTo(a: IValue, b: IValue): Value<boolean> {
        return new Value(ValueDataType.Boolean, ValueComparer.compare(a, b) != ComparisonResult.LessThan);
    }

    /**
     * Checks if the values are equal.
     * @param strict Pass true for strict equality check.
     */
    public static areEqual(a: IValue, b: IValue, strict = false): boolean {
        if (a.dataType === ValueDataType.Undefined || b.dataType === ValueDataType.Undefined) {
            // First, ensure we don't have any undefineds
            throw new Error('Undefined values cannot be compared. This should have been handled earlier.');

        } else if (a.dataType !== ValueDataType.Array && b.dataType !== ValueDataType.Array) {
            // Scalar types are simply compared by value
            const typesMatch = a.dataType === b.dataType || !strict;
            return typesMatch && a.toString() === b.toString();

        } else if (a.dataType === ValueDataType.Array && b.dataType === ValueDataType.Array) {
            // Arrays are compared elementwise
            const data1 = a.value as Value[];
            const data2 = b.value as Value[];
            if (data1.length !== data2.length) {
                return false;
            }

            for (let i = 0; i < data1.length; i++) {
                if (!ValueComparer.areEqual(data1[i], data2[i], strict)) {
                    return false;
                }
            }
            return true;

        } else {
            // Trying to compare an array to something else
            if (strict) {
                return false;
            }
            if (a.dataType === ValueDataType.Array && (a.value as Value[]).length === 0) {
                return (b.dataType === ValueDataType.Boolean && !b.isTruthy()) ||
                    b.dataType === ValueDataType.Null;
            } else if (b.dataType === ValueDataType.Array && (b.value as Value[]).length === 0) {
                return (a.dataType === ValueDataType.Boolean && !a.isTruthy()) ||
                    a.dataType === ValueDataType.Null;
            } else {
                return false;
            }
        }
    }

    /** Performs a numerical or textual comparison of the values. */
    public static compare(a: IValue, b: IValue): ComparisonResult {
        const value1 = a.toString();
        const value2 = b.toString();

        // See https://www.php.net/manual/en/language.types.numeric-strings.php
        const isNumeric = (value: string) => /^\s*[+-]?(\d+\.?\d*|\.\d+)(E[+-]?\d+)?\s*$/i.test(value);

        // If both are numeric, compare numerically,
        // otherwise compare as strings
        if(isNumeric(value1) && isNumeric(value2)) {
            const number1 = parseFloat(value1);
            const number2 = parseFloat(value2);
            if (number1 < number2) {
                return ComparisonResult.LessThan;
            } else if (number1 > number2) {
                return ComparisonResult.GreaterThan;
            } else {
                return ComparisonResult.Equal;
            }
        } else {
            if (value1 < value2) {
                return ComparisonResult.LessThan;
            } else if (value1 > value2) {
                return ComparisonResult.GreaterThan;
            } else {
                return ComparisonResult.Equal;
            }
        }
    }
}

enum ComparisonResult {
    LessThan = -1,
    Equal = 0,
    GreaterThan = 1
}