import { ValueDataType } from './ValueDataType.js';

/**
 * This interface represents values that can exist during the evaluation of a filter.
 * Values have the same properties as their counterparts in the upstream, especially
 * with respect to type conversions.
 * @param TValue Native JavaScript type of the stored value
 */
export interface IValue<TValue = unknown> {

    /** The stored data type */
    get dataType(): ValueDataType;

    /** The stored value */
    get value(): TValue;

    /** Whether it's an undefined value */
    get isUndefined() : boolean;

    /**
     * Converts the value to boolean, i.e. returns true if the value
     * is truthy and false otherwise. If this value is undefined,
     * returns an undefined IValue.
     */
    asBoolean(): IValue<boolean | null>;

    /**
     * Converts this value to an integer. If this value is undefined,
     * returns an undefined IValue.
     */
    asInt(): IValue<number | null>;

    /**
     * Converts this value to a float. If this value is undefined,
     * returns an undefined IValue.
     */
    asFloat(): IValue<number | null>;

    /**
     * Converts this value to a string. If this value is undefined,
     * returns an undefined IValue.
     */
    asString(): IValue<string | null>;

    /**
     * Converts this value to an array. If this value is undefined,
     * returns an undefined IValue.
     */
    asArray(): IValue<IValue[] | null>;

    /**
     * Convenience method to convert this value to a boolean and
     * return its value as a native boolean. If this value is undefined,
     * returns null.
     */
    isTruthy(): boolean | null;

    /**
     * Returns a value stored at a given index of the array. The array is 0-indexed.
     * Throws an error if the value is not an array or the index is out of bounds.
     * @param index The index of the element to retrieve
     */
    getElementAt(index: IValue): IValue;

    /**
     * Stores a given value at the given index of the array. The array is 0-indexed.
     * Throws an error if the value is not an array or the index is out of bounds.
     * @param index The index where to store the value
     */
    setElementAt(index: IValue, value: IValue): void;

    /**
     * Appends a value to the array.
     * Throws an error if the value is not an array.
     * @param value The value to be appended to the array
     */
    appendElement(value: IValue): void;

    /** Converts this value to a literal that can appear in the AbuseFilter code */
    toLiteral(): string;
}
