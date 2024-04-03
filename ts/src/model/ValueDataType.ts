/**
 * An enum that represents valid types for values to be held in variables.
 */
export enum ValueDataType {
    Boolean = 'boolean',
    Integer = 'integer',
    Float = 'float',
    String = 'string',
    Array = 'array',
    Null = 'null',

    /** Does not correspond to any AbuseFilter data types, it's used for nodes unevaluated yet */
    Undefined = 'undefined',
}