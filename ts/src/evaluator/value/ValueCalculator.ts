import { IValue } from '../../model/value/IValue.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { Value } from './Value.js';

export class ValueCalculator {
    /** Performs an addition or concatenation */
    public static add(augend: IValue, addend: IValue): IValue {
        if (augend.dataType === ValueDataType.Undefined || addend.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        } else if (augend.dataType === ValueDataType.String || addend.dataType === ValueDataType.String) {
            return new Value(ValueDataType.String, augend.toString() + addend.toString());
        } else if (augend.dataType === ValueDataType.Array && addend.dataType === ValueDataType.Array) {
            return new Value(ValueDataType.Array, augend.toArray().concat(addend.toArray()));
        } else {
            const res = augend.toNumber() + addend.toNumber();
            const type = (augend.dataType === ValueDataType.Float) || (addend.dataType === ValueDataType.Float) ?
                ValueDataType.Float : ValueDataType.Integer;

            return new Value(type, res);
        }
    }

    /** Performs an addition of many values */
    public static addValues(values: IValue[]): IValue {
        if (values.length === 1) {
            return values[0];
        }

        let result = values[0];
        for (let i = 1; i < values.length; i++) {
            result = ValueCalculator.add(result, values[i]);
        }
        return result;
    }

    /** Subtracts the other value from this one */
    public static subtract(minuend: IValue, subtrahend: IValue): IValue {
        if (minuend.dataType === ValueDataType.Undefined || subtrahend.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }
        const res = minuend.toNumber() - subtrahend.toNumber();
        const type = (minuend.dataType === ValueDataType.Float) || (subtrahend.dataType === ValueDataType.Float) ?
            ValueDataType.Float : ValueDataType.Integer;

        return new Value(type, res);
    }

    /** Multiplies this value by the other */
    public static multiply(multiplicand: IValue, multiplier: IValue): IValue {
        if (multiplicand.dataType === ValueDataType.Undefined || multiplier.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }
        const res = multiplicand.toNumber() * multiplier.toNumber();
        const type = (multiplicand.dataType === ValueDataType.Float) || (multiplier.dataType === ValueDataType.Float) ?
            ValueDataType.Float : ValueDataType.Integer;

        return new Value(type, res);
    }

    /** Performs a multiplication of many values */
    public static multiplyValues(values: IValue[]): IValue {
        if (values.length === 1) {
            return values[0];
        }

        let result = values[0];
        for (let i = 1; i < values.length; i++) {
            result = ValueCalculator.multiply(result, values[i]);
        }
        return result;
    }

    /** Divides the value by the specified divisor. Throws an error if the divisor is zero. */
    public static divide(dividend: IValue, divisor: IValue): IValue {
        if (divisor.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        if (divisor.toNumber() === 0) {
            throw new Error('dividebyzero');
        }

        if (dividend.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        const res = dividend.toNumber() / divisor.toNumber();
        const isOperandFloat = (dividend.dataType === ValueDataType.Float) || (divisor.dataType === ValueDataType.Float);
        const type = isOperandFloat || (res % 1 !== 0) ? ValueDataType.Float : ValueDataType.Integer;

        return new Value(type, res);
    }

    /** Computes a remainder of the division of this value by the other. */
    public static modulo(dividend: IValue, divisor: IValue): IValue {
        if (divisor.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        if (divisor.toNumber() === 0) {
            throw new Error('dividebyzero');
        }

        if (dividend.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        // AbuseFilter converts operands to int for modulo
        const res = Math.floor(dividend.toNumber()) % Math.floor(divisor.toNumber());

        return new Value(ValueDataType.Integer, res);
    }

    /** Returns the result of raising this value to the given power */
    public static pow(base: IValue, exponent: IValue): IValue {
        if (base.dataType === ValueDataType.Undefined || exponent.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        const res = Math.pow(base.toNumber(), exponent.toNumber());
        const isOperandFloat = (base.dataType === ValueDataType.Float) || (exponent.dataType === ValueDataType.Float);
        const type = isOperandFloat || (res % 1 !== 0) ? ValueDataType.Float : ValueDataType.Integer;

        return new Value(type, res);
    }

    /** Returns an arithmetic negation of the value */
    public static negate(value: IValue): IValue {
        if (value.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        const res = -value.toNumber();
        const type = (res % 1 === 0) ? ValueDataType.Integer : ValueDataType.Float;

        return new Value(type, res);
    }

    /** Performs a logical conjunction of the values. The result is always a boolean or undefined. */
    public static and(operands: IValue[]): IValue<boolean | null> {
        let hasUndefined = false;
        for (const operand of operands) {
            if (operand.dataType === ValueDataType.Undefined) {
                hasUndefined = true;
            } else if (!operand.isTruthy()) {
                return Value.False;
            }
        }
        return !hasUndefined ? Value.True : Value.Undefined;
    }

    /** Performs a logical alternative of the values. The result is always a boolean or undefined. */
    public static or(operands: IValue[]): IValue<boolean | null> {
        let hasUndefined = false;
        for (const operand of operands) {
            if (operand.dataType === ValueDataType.Undefined) {
                hasUndefined = true;
            } else if (operand.isTruthy()) {
                return Value.True;
            }
        }
        return !hasUndefined ? Value.True : Value.Undefined;
    }

    /** Performs a logical exclusive alternative of the values. The result is always a boolean or undefined. */
    public static xor(operands: IValue[]): IValue<boolean | null> {
        let trueCount = 0;
        for (const operand of operands) {
            if (operand.dataType === ValueDataType.Undefined) {
                return Value.Undefined;
            } else if (operand.isTruthy()) {
                trueCount++;
            }
        }
        return (trueCount % 2 === 1) ? Value.True : Value.False;
    }

    /** Returns a boolean negation of the value */
    public static not(value: IValue): IValue<boolean | null> {
        if (value.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        return value.isTruthy() ? Value.False : Value.True;
    }
}