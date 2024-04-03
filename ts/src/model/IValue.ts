import { ValueDataType } from './ValueDataType.js';

export interface IValue<TValue = unknown> {

    /** The stored data type */
    get dataType(): ValueDataType;

    /** The stored value */
    get value(): TValue;

    castToBoolean(): IValue<boolean>;

    castToInt(): IValue<number>;

    castToFloat(): IValue<number>;

    castToString(): IValue<string>;

    castToArray(): IValue<unknown[]>;

    isTruthy(): boolean;

    toNumber(): number;

    toString(): string;

    toArray(): unknown[];

    getElementAt(index: number | IValue): IValue;

    setElementAt(index: number | IValue, value: IValue): void;

    appendElement(value: IValue): void;
}
