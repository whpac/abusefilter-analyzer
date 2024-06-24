import { ValueDataType } from './ValueDataType.js';

export interface IValue<TValue = unknown> {

    /** The stored data type */
    get dataType(): ValueDataType;

    /** The stored value */
    get value(): TValue;

    /** Whether it's an undefined value */
    get isUndefined() : boolean;

    castToBoolean(): IValue<boolean | null>;

    castToInt(): IValue<number | null>;

    castToFloat(): IValue<number | null>;

    castToString(): IValue<string | null>;

    castToArray(): IValue<unknown[] | null>;

    isTruthy(): boolean | undefined;

    toNumber(): number;

    toString(): string;

    toArray(): IValue[];

    getElementAt(index: number | IValue): IValue;

    setElementAt(index: number | IValue, value: IValue): void;

    appendElement(value: IValue): void;

    /** Converts this value to a literal that can appear in the AbuseFilter code */
    toLiteral(): string;
}
