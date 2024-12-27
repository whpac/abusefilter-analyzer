import { TokenType } from './TokenType.js';

/**
 * A basic unit of filter source code that can be understood by the rule parser.
 */
export interface IToken {
    /** The type of this token. */
    get type(): TokenType;

    /** The value associated with this token. */
    get value(): string;
}