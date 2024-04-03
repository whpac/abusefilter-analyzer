import { IToken } from '../model/IToken.js';
import { TokenType } from '../model/TokenType.js';

/**
 * Represents a token found in the input sequence.
 */
export class Token implements IToken {
    /** A value for EndOfStream tokens. */
    public static readonly EOF = '';

    /** The type of this token */
    public readonly type: TokenType;

    /** The value associated with this token. For end of stream token, it's always Token.EOF */
    public readonly value: string;

    /** The position in the input sequence where this token starts. */
    public readonly startPosition: number;

    /**
     * Number of characters in the input stream that belong to this token.
     * This corresponds to the length in the input string and may differ from the length of the value.
     */
    public readonly length: number;

    /**
     * @param type The token type.
     * @param value The value of the token. For end of stream tokens, use Token.EOF.
     */
    public constructor(type: TokenType, value: string, startPosition: number, length: number) {
        this.type = type;
        this.value = value;
        this.startPosition = startPosition;
        this.length = length;

        if (type === TokenType.EndOfStream) this.value = Token.EOF;
    }

    /**
     * Convenience function for checking the token type and value.
     * @param type The token type to check.
     * @param value The token value to check. Can be a string, an array of strings or null.
     * @returns True if type and value are equal. If value is an array, returns true if the token value is in the array.
     */
    public is(type: TokenType, value?: string[] | string | null): boolean {
        if (value === undefined) {
            return this.type === type;
        }
        if (typeof value === 'string' || value === null) {
            return this.type === type && this.value === value;
        }
        return this.type === type && value.includes(this.value as string);
    }
}