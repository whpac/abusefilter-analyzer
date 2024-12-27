import { TokenType } from '../../model/tokens/TokenType.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { IToken } from '../../model/tokens/IToken.js';
import { IValue } from '../../model/value/IValue.js';
import { ValueConverter } from './ValueConverter.js';

/**
 * A class representing a value in the evaluation tree.
 * 
 * It has a value-type semantics and therefore is immutable.
 */
export class Value<TValue = unknown> implements IValue<TValue> {
    /** The stored data type */
    public readonly dataType: ValueDataType;

    /** The stored value */
    public readonly value: TValue;

    public get isUndefined(): boolean {
        return this.dataType === ValueDataType.Undefined;
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
        this.value = value;

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

    /** Creates a new Value from a native JavaScript value */
    public static fromNative(value: unknown): Value {
        if (value === null) {
            return Value.Null;
        }

        if (value === undefined) {
            return Value.Undefined;
        }

        if (typeof value === 'boolean') {
            return new Value(ValueDataType.Boolean, value);
        }

        if (typeof value === 'number') {
            if (Number.isInteger(value)) {
                return new Value(ValueDataType.Integer, value);
            }
            return new Value(ValueDataType.Float, value);
        }

        if (typeof value === 'string') {
            return new Value(ValueDataType.String, value);
        }

        if (Array.isArray(value)) {
            return new Value(ValueDataType.Array, value.map(v => Value.fromNative(v)));
        }

        throw new Error(`Cannot create a value from native value ${value}`);
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
    public isTruthy(): boolean | null {
        return this.asBoolean().value;
    }

    public toString(): string {
        return this.toLiteral();
    }

    public asBoolean(): Value<boolean | null> {
        return ValueConverter.toBoolean(this);
    }

    public asInt(): Value<number | null> {
        return ValueConverter.toInt(this);
    }

    public asFloat(): Value<number | null> {
        return ValueConverter.toFloat(this);
    }

    public asString(): Value<string | null> {
        return ValueConverter.toString(this);
    }

    public asArray(): Value<IValue[] | null> {
        return ValueConverter.toArray(this);
    }

    // ! Array operators
    public getElementAt(index: IValue): IValue {
        if (this.dataType !== ValueDataType.Array) {
            throw new Error('Cannot index a non-array value');
        }

        const numIndex = index.asInt().value!;
        const array = this.value as IValue[];
        if (numIndex < 0 || numIndex >= array.length) {
            throw new Error('Index out of bounds');
        }
        return array[numIndex] ?? Value.Undefined;
    }

    public setElementAt(index: IValue, value: IValue): void {
        if (this.dataType !== ValueDataType.Array) {
            throw new Error('Cannot index a non-array value');
        }

        const numIndex = index.asInt().value!;
        const array = this.value as IValue[];
        if (numIndex < 0 || numIndex >= array.length) {
            throw new Error('Index out of bounds');
        }
        array[numIndex] = value;
    }

    public appendElement(value: IValue): void {
        if (this.dataType !== ValueDataType.Array) {
            throw new Error('Cannot append to a non-array value');
        }
        (this.value as IValue[]).push(value);
    }

    public toLiteral(): string {
        switch (this.dataType) {
            case ValueDataType.Boolean:
                return this.value ? 'true' : 'false';
            case ValueDataType.Integer:
            case ValueDataType.Float:
                return this.asString().value!;
            case ValueDataType.String: {
                let val = this.value as string;
                val = val.replace(/\\/g, '\\\\');
                val = val.replace(/"/g, '\\"');
                val = val.replace(/\n/g, '\\n');
                val = val.replace(/\r/g, '\\r');
                val = val.replace(/\t/g, '\\t');
                // TODO: Are there any other? eg. \0, \x00
                return '"' + val + '"';
            }
            case ValueDataType.Array:
                return '[' + (this.value as IValue[]).map(v => v.toLiteral()).join(', ') + ']';
            case ValueDataType.Null:
                return 'null';
            case ValueDataType.Undefined:
                return 'undefined';
        }
    }
}
