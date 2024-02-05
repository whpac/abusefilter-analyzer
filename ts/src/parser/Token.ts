import { TokenType } from './TokenType.js';

/**
 * Represents a token found in the input sequence.
 */
export class Token {
    /** The type of this token */
    public readonly type: TokenType;

    /** The value associated with this token. May be null for some token types. */
    public readonly value: string | null;

    /** The position in the input sequence where this token starts. */
    public readonly startPosition: number;

    /**
     * Number of characters in the input stream that belong to this token.
     * This corresponds to the length in the input string and may differ from the length of the value.
     */
    public readonly length: number;

    /**
     * @param type The token type.
     * @param value The value of the token. Optional for some token types.
     */
    public constructor(type: TokenType, value: string | null, startPosition: number, length: number) {
        this.type = type;
        this.value = value;
        this.startPosition = startPosition;
        this.length = length;
    }
}