import { TokenType } from '../../model/tokens/TokenType.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { IToken } from '../../model/tokens/IToken.js';
import { IValue } from '../../model/value/IValue.js';

/**
 * A class representing a value in the evaluation tree.
 * 
 * It has a value-type semantics and therefore is immutable.
 */
export class Value<TValue = unknown> implements IValue<TValue> {
    /** The stored data type */
    public readonly dataType: ValueDataType;

    protected readonly _value: TValue;

    /** The stored value */
    public get value(): TValue {
        return this._value;
    }

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
        this._value = value;

        if (!this.isValid()) {
            throw new Error(`Invalid value for data type ${dataType}: ${value}`);
        }
    }

    /** Creates a new Value from a token literal */
    public static fromTokenLiteral(token: IToken): Value {
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
                    if (!(item instanceof Value) || !item.isValid()) return false;
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

    // ! Casting methods

    /**
     * Checks if the value is truthy
     * @see https://www.php.net/manual/en/language.types.boolean.php#language.types.boolean.casting
     */
    public isTruthy(): boolean {
        if (this.dataType === ValueDataType.Boolean) {
            return this.value as boolean;
        }

        if (this.dataType === ValueDataType.Integer || this.dataType === ValueDataType.Float) {
            return (this.value !== 0);
        }

        if (this.dataType === ValueDataType.String) {
            return (this.value !== '0' || this.value === '');
        }

        if (this.dataType === ValueDataType.Array) {
            return (this.value as unknown[]).length !== 0;
        }

        if (this.dataType === ValueDataType.Null || this.dataType === ValueDataType.Undefined) {
            return false;
        }

        return true;
    }

    /** Converts the value to string */
    public toString(): string {
        switch (this.dataType) {
            case ValueDataType.Array:
                return (this.value as Value[]).map(v => v.toString()).join('\n') + '\n';
            case ValueDataType.Boolean:
                return this.value ? '1' : ''; // Like PHP's strval()...
            case ValueDataType.Null:
                return '';
        }
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
            case ValueDataType.Array:
                return (this.value as Value[]).length;
            default:
                return parseFloat(this.toString());
        }
    }

    /** Converts the value to array */
    public toArray(): IValue[] {
        if (this.dataType === ValueDataType.Array) {
            return this.value as Value[];
        }
        return [ this ];
    }

    /**
     * Converts the value to boolean, i.e. returns true if the value
     * is truthy and false otherwise
     */
    public castToBoolean(): Value<boolean> {
        return new Value(ValueDataType.Boolean, this.isTruthy());
    }

    /** Converts the value to integer */
    public castToInt(): Value<number> {
        return new Value(ValueDataType.Integer, Math.floor(this.toNumber()));
    }

    /** Converts the value to float */
    public castToFloat(): Value<number> {
        return new Value(ValueDataType.Float, this.toNumber());
    }

    /** Converts the value to string */
    public castToString(): Value<string> {
        return new Value(ValueDataType.String, this.toString());
    }

    /** Converts the value to array */
    public castToArray(): Value<unknown[]> {
        return new Value(ValueDataType.Array, this.toArray());
    }

    // ! Array operators

    /**
     * Returns a value stored at a given index of the array. The array is 0-indexed.
     * @param index The index of the element to retrieve
     */
    public getElementAt(index: number | IValue): IValue {
        if (this.dataType !== ValueDataType.Array) {
            throw new Error('Cannot index a non-array value');
        }

        if (typeof index === 'object') {
            index = index.toNumber();
        }

        const array = this.value as IValue[];
        if (index < 0 || index >= array.length) {
            throw new Error('Index out of bounds');
        }
        return array[index] ?? Value.Undefined;
    }

    /**
     * Stores a given value at the given index of the array. The array is 0-indexed.
     * @param index The index where to store the value
     */
    public setElementAt(index: number | IValue, value: IValue): void {
        if (this.dataType !== ValueDataType.Array) {
            throw new Error('Cannot index a non-array value');
        }

        if (typeof index === 'object') {
            index = index.toNumber();
        }

        const array = this.value as IValue[];
        if (index < 0 || index >= array.length) {
            throw new Error('Index out of bounds');
        }
        array[index] = value;
    }

    /**
     * Appends a value to the array.
     * @param value The value to be appended to the array
     */
    public appendElement(value: IValue): void {
        if (this.dataType !== ValueDataType.Array) {
            throw new Error('Cannot append to a non-array value');
        }
        (this.value as IValue[]).push(value);
    }
}
