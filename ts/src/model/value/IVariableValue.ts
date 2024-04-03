import { IValue } from './IValue.js';

export interface IVariableValue<TValue = unknown> extends IValue<TValue> {

    /** The name of this variable */
    get name(): string;
}