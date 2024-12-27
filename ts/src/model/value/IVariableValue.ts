import { IValue } from './IValue.js';

/**
 * Represents a value, that apart from being a normal value, can be assigned to
 * (aka. l-value). These values are used to represent variables.
 */
export interface IVariableValue<TValue = unknown> extends IValue<TValue> {

    /** The name of this variable */
    get name(): string;
}