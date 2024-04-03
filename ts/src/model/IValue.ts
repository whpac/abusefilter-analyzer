import { ValueDataType } from './ValueDataType.js';

export interface IValue<TValue = unknown> {

    /** The stored data type */
    get dataType(): ValueDataType;

    /** The stored value */
    get value(): TValue;
}