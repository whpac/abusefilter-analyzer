import { TokenType } from './TokenType.js';

export interface IToken {
    /** The type of this token. */
    get type(): TokenType;

    /** The value associated with this token. */
    get value(): string;
}