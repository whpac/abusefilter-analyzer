import { Token } from '../parser/Token.js';
import { TokenType } from '../parser/TokenType.js';
import { ValueDataType } from './ValueDataType.js';

/**
 * A class representing a value in the evaluation tree.
 * 
 * It has a value-type semantics and therefore is immutable.
 */
export class Value<TValue = unknown> {
    /** The stored data type */
    public readonly dataType: ValueDataType;

    /** The stored value */
    public readonly value: TValue;

    /** For convenience, an undefined value */
    public static readonly Undefined = new Value(ValueDataType.Undefined, null);
    /** For convenience, a null value */
    public static readonly Null = new Value(ValueDataType.Null, null);
    /** For convenience, a true value */
    public static readonly True = new Value(ValueDataType.Boolean, true);
    /** For convenience, a false value */
    public static readonly False = new Value(ValueDataType.Boolean, false);

    public constructor(dataType: ValueDataType, value: TValue) {
        this.dataType = dataType;
        this.value = value;

        if (!this.isValid()) {
            throw new Error(`Invalid value for data type ${dataType}: ${value}`);
        }
    }

    /** Creates a new Value from a token literal */
    public static fromTokenLiteral(token: Token): Value {
        switch (token.type) {
            case TokenType.StringLiteral:
                return new Value(ValueDataType.String, token.value);
            case TokenType.IntLiteral:
                return new Value(ValueDataType.Integer, parseInt(token.value));
            case TokenType.FloatLiteral:
                return new Value(ValueDataType.Float, parseFloat(token.value));
            case TokenType.Keyword:
                if (token.value === 'true' || token.value === 'false') {
                    return new Value(ValueDataType.Boolean, token.value === 'true');
                }
                if (token.value === 'null') {
                    return new Value(ValueDataType.Null, null);
                }
                throw new Error(`Cannot create a value from keyword ${token.value}`);
            default:
                throw new Error(`Cannot create a value from token of type ${token.type}`);
        }
    }

    /** Returns true if the stored value corresponds to the declared data type */
    protected isValid(): boolean {
        switch (this.dataType) {
            case ValueDataType.Boolean:
                return typeof this.value === 'boolean';
            case ValueDataType.Integer:
                return typeof this.value === 'number' && Number.isInteger(this.value);
            case ValueDataType.Float:
                return typeof this.value === 'number';
            case ValueDataType.String:
                return typeof this.value === 'string';
            case ValueDataType.Array:
                if (!Array.isArray(this.value)) return false;
                for (const item of this.value) {
                    if (!(item instanceof Value)) return false;
                }
                return true;
            case ValueDataType.Null:
                return this.value === null;
            case ValueDataType.Undefined:
                return this.value === null;
        }
        // Just in case, should never happen
        return false;
    }

    /** Checks if the value is truthy */
    public isTruthy(): boolean {
        return this.asBoolean().value;
    }

    /** Converts the value to string */
    public toString(): string {
        return '' + this.value;
    }

    /** Converts the value to number */
    public toNumber(): number {
        switch (this.dataType) {
            case ValueDataType.Integer:
            case ValueDataType.Float:
                return this.value as number;
            case ValueDataType.Boolean:
                return this.value ? 1 : 0;
            case ValueDataType.Null:
                return 0;
            default:
                return parseFloat(this.toString());
        }
    }

    /** Converts the value to array */
    public toArray(): unknown[] {
        if (this.dataType === ValueDataType.Array) {
            return this.value as Value[];
        }
        return [ this ];
    }

    /**
     * Converts the value to boolean, i.e. returns true if the value
     * is truthy and false otherwise
     * @see https://www.php.net/manual/en/language.types.boolean.php#language.types.boolean.casting
     */
    public asBoolean(): Value<boolean> {
        if (this.dataType === ValueDataType.Boolean) {
            return this as Value<boolean>;
        }

        if (this.dataType === ValueDataType.Integer || this.dataType === ValueDataType.Float) {
            return (this.value !== 0) ? Value.True : Value.False;
        }

        if (this.dataType === ValueDataType.String) {
            return (this.value !== '0' || this.value === '') ? Value.True : Value.False;
        }

        if (this.dataType === ValueDataType.Array) {
            return (this.value as unknown[]).length !== 0 ? Value.True : Value.False;
        }

        if (this.dataType === ValueDataType.Null || this.dataType === ValueDataType.Undefined) {
            return Value.False;
        }

        return Value.True;
    }

    /**
     * Returns a value stored at a given index of the array. The array is 0-indexed.
     * @param index The index of the element to retrieve
     */
    public getElementAt(index: number | Value): Value {
        if (this.dataType !== ValueDataType.Array) {
            throw new Error('Cannot index a non-array value');
        }

        if (typeof index === 'object') {
            index = index.toNumber();
        }

        const array = this.value as Value[];
        if (index < 0 || index >= array.length) {
            throw new Error('Index out of bounds');
        }
        return array[index] ?? Value.Undefined;
    }

    /**
     * Stores a given value at the given index of the array. The array is 0-indexed.
     * @param index The index where to store the value
     */
    public setElementAt(index: number | Value, value: Value): void {
        if (this.dataType !== ValueDataType.Array) {
            throw new Error('Cannot index a non-array value');
        }

        if (typeof index === 'object') {
            index = index.toNumber();
        }

        const array = this.value as Value[];
        if (index < 0 || index >= array.length) {
            throw new Error('Index out of bounds');
        }
        array[index] = value;
    }

    /**
     * Appends a value to the array.
     * @param value The value to be appended to the array
     */
    public appendElement(value: Value): void {
        if (this.dataType !== ValueDataType.Array) {
            throw new Error('Cannot append to a non-array value');
        }
        (this.value as Value[]).push(value);
    }

    // ! Equality operators

    /**
     * Checks if the value is strictly equal to the other.
     * Strict equality requires the data types and values to be
     * exactly the same.
     * @param other The other value to check
     */
    public isStrictlyEqualTo(other: Value): Value<boolean> {
        return new Value(ValueDataType.Boolean, this.isEqualTo(other, true));
    }

    /**
     * Checks if the value is strictly inequal to the other.
     * @param other The other value to check
     */
    public isStrictlyInequalTo(other: Value): Value<boolean> {
        return new Value(ValueDataType.Boolean, !this.isEqualTo(other, true));
    }

    /**
     * Checks if the value is loosely equal to the other.
     * Loose equality allows for different data types to be equal
     * @param other The other value to check
     */
    public isLooselyEqualTo(other: Value): Value<boolean> {
        return new Value(ValueDataType.Boolean, this.isEqualTo(other, false));
    }

    /**
     * Checks if the value is loosely inequal to the other.
     * @param other The other value to check
     */
    public isLooselyInequalTo(other: Value): Value<boolean> {
        return new Value(ValueDataType.Boolean, !this.isEqualTo(other, false));
    }

    /**
     * Checks if the value is equal to the other.
     * @param other The other value to check.
     * @param strict Pass true for strict equality check.
     */
    protected isEqualTo(other: Value, strict = false): boolean {
        if (this.dataType === ValueDataType.Undefined || other.dataType === ValueDataType.Undefined) {
            // First, ensure we don't have any undefineds
            throw new Error('Undefined values cannot be compared. This should have been handled earlier.');

        } else if (this.dataType !== ValueDataType.Array && other.dataType !== ValueDataType.Array) {
            // Scalar types are simply compared by value
            const typesMatch = this.dataType === other.dataType || !strict;
            return typesMatch && this.toString() === other.toString();

        } else if (this.dataType === ValueDataType.Array && other.dataType === ValueDataType.Array) {
            // Arrays are compared elementwise
            const data1 = this.value as Value[];
            const data2 = other.value as Value[];
            if (data1.length !== data2.length) {
                return false;
            }

            for (let i = 0; i < data1.length; i++) {
                if (!data1[i].isEqualTo(data2[i], strict)) {
                    return false;
                }
            }
            return true;

        } else {
            // Trying to compare an array to something else
            if (strict) {
                return false;
            }
            if (this.dataType === ValueDataType.Array && (this.value as Value[]).length === 0) {
                return (other.dataType === ValueDataType.Boolean && !other.isTruthy()) ||
                    other.dataType === ValueDataType.Null;
            } else if (other.dataType === ValueDataType.Array && (other.value as Value[]).length === 0) {
                return (this.dataType === ValueDataType.Boolean && !this.isTruthy()) ||
                    this.dataType === ValueDataType.Null;
            } else {
                return false;
            }
        }
    }

    // ! Comparison operators
    public isLessThan(other: Value): Value<boolean> {
        return new Value(ValueDataType.Boolean, this.compareTo(other) == ComparisonResult.LessThan);
    }

    public isLessThanOrEqualTo(other: Value): Value<boolean> {
        return new Value(ValueDataType.Boolean, this.compareTo(other) != ComparisonResult.GreaterThan);
    }

    public isGreaterThan(other: Value): Value<boolean> {
        return new Value(ValueDataType.Boolean, this.compareTo(other) == ComparisonResult.GreaterThan);
    }

    public isGreaterThanOrEqualTo(other: Value): Value<boolean> {
        return new Value(ValueDataType.Boolean, this.compareTo(other) != ComparisonResult.LessThan);
    }

    /** Performs a numerical or textual comparison of the values. */
    protected compareTo(other: Value): ComparisonResult {
        const value1 = this.toString();
        const value2 = other.toString();

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

    // ! Arithmetic operators
    /** Performs an addition or concatenation */
    public add(addend: Value): Value {
        if (this.dataType === ValueDataType.Undefined || addend.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        } else if (this.dataType === ValueDataType.String || addend.dataType === ValueDataType.String) {
            return new Value(ValueDataType.String, this.toString() + addend.toString());
        } else if (this.dataType === ValueDataType.Array && addend.dataType === ValueDataType.Array) {
            return new Value(ValueDataType.Array, this.toArray().concat(addend.toArray()));
        } else {
            const res = this.toNumber() + addend.toNumber();
            const type = (this.dataType === ValueDataType.Integer) && (addend.dataType === ValueDataType.Integer) ?
                ValueDataType.Integer : ValueDataType.Float;

            return new Value(type, res);
        }
    }

    /** Subtracts the other value from this one */
    public subtract(subtrahent: Value): Value {
        if (this.dataType === ValueDataType.Undefined || subtrahent.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }
        const res = this.toNumber() - subtrahent.toNumber();
        const type = (this.dataType === ValueDataType.Integer) && (subtrahent.dataType === ValueDataType.Integer) ?
            ValueDataType.Integer : ValueDataType.Float;

        return new Value(type, res);
    }

    /** Multiplies this value by the other */
    public multiply(factor: Value): Value {
        if (this.dataType === ValueDataType.Undefined || factor.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }
        const res = this.toNumber() * factor.toNumber();
        const type = (this.dataType === ValueDataType.Integer) && (factor.dataType === ValueDataType.Integer) ?
            ValueDataType.Integer : ValueDataType.Float;

        return new Value(type, res);
    }

    /** Divides the value by the specified divisor. Throws an error if the divisor is zero. */
    public divide(divisor: Value): Value {
        if (divisor.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        if (divisor.toNumber() === 0) {
            throw new Error('dividebyzero');
        }

        if (this.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        const res = this.toNumber() / divisor.toNumber();
        const isOperandFloat = (this.dataType === ValueDataType.Float) || (divisor.dataType === ValueDataType.Float);
        const type = isOperandFloat || (res % 1 !== 0) ? ValueDataType.Float : ValueDataType.Integer;

        return new Value(type, res);
    }

    /** Computes a remainder of the division of this value by the other. */
    public modulo(divisor: Value): Value {
        if (divisor.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        if (divisor.toNumber() === 0) {
            throw new Error('dividebyzero');
        }

        if (this.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        // AbuseFilter converts operands to int for modulo
        const res = Math.floor(this.toNumber()) % Math.floor(divisor.toNumber());

        return new Value(ValueDataType.Integer, res);
    }

    /** Returns the result of raising this value to the given power */
    public pow(exponent: Value): Value {
        if (this.dataType === ValueDataType.Undefined || exponent.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        const res = Math.pow(this.toNumber(), exponent.toNumber());
        const isOperandFloat = (this.dataType === ValueDataType.Float) || (exponent.dataType === ValueDataType.Float);
        const type = isOperandFloat || (res % 1 !== 0) ? ValueDataType.Float : ValueDataType.Integer;

        return new Value(type, res);
    }

    /** Returns an arithmetic negation of the value */
    public negate(): Value {
        if (this.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        const res = -this.toNumber();
        const type = (res % 1 === 0) ? ValueDataType.Integer : ValueDataType.Float;

        return new Value(type, res);
    }


    // ! Logical operators

    /** Performs a logical conjunction of the values. The result is always a boolean. */
    public static and(operands: Value[]): Value<boolean> {
        for (const operand of operands) {
            if (!operand.isTruthy()) {
                return Value.False;
            }
        }
        return Value.True;
    }

    /** Performs a logical alternative of the values. The result is always a boolean. */
    public static or(operands: Value[]): Value<boolean> {
        for (const operand of operands) {
            if (operand.isTruthy()) {
                return Value.True;
            }
        }
        return Value.False;
    }

    /** Performs a logical exclusive alternative of the values. The result is always a boolean. */
    public static xor(operands: Value[]): Value<boolean> {
        let trueCount = 0;
        for (const operand of operands) {
            if (operand.isTruthy()) {
                trueCount++;
            }
        }
        return (trueCount % 2 === 1) ? Value.True : Value.False;
    }

    /** Returns a boolean negation of the value */
    public not(): Value {
        if (this.dataType === ValueDataType.Undefined) {
            return Value.Undefined;
        }

        return this.isTruthy() ? Value.False : Value.True;
    }

}

enum ComparisonResult {
    LessThan = -1,
    Equal = 0,
    GreaterThan = 1
}