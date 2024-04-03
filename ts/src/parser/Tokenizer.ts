import { Token } from './Token.js';
import { TokenType } from '../model/tokens/TokenType.js';

/**
 * Essential class for AbuseFilter rule preparation before actual parsing.
 * 
 * Converts the string representation of an expression into a sequence of tokens.
 * 
 * Based on https://phabricator.wikimedia.org/diffusion/EABF/browse/master/includes/Parser/AbuseFilterTokenizer.php
 */
export class Tokenizer {

    /** Regular expression to find beginning of a comment after potentially some whitespaces. */
    private readonly commentStartRegex = /\s*\/\*/y;

    /** Regular expression to find operators. Ordered so that the longest will try to be mathed first. */
    private readonly operatorsRegex = /(!==|!=|!|\*\*|\*|\/|\+|-|%|&|\||\^|:=|\?|:|<=|<|>=|>|===|==|=)/y;

    /** Regular expression to match numbers in varying bases. */
    private readonly numberRegex = /(?:0(?<base>[xbo]))?(?<number>[0-9A-Fa-f]+(?:\.\d*)?|\.\d+)(?!\w)/y;

    /**
     * Regular expression to match identifiers and keywords. We allow for identifiers starting with digit,
     * they are however caught earlier when parsing numbers.
     */
    private readonly identifierRegex = /[0-9A-Za-z_]+/y;

    /** Characters to be ignored when between tokens. */
    private static readonly whitespaces = [' ', '\t', '\n', '\v', '\f', '\r'];

    /** General mapping of puntuation characters into their respective token types. */
    private static readonly punctuationTokens = new Map<string, TokenType>([
        ['(', TokenType.Parenthesis],
        [')', TokenType.Parenthesis],
        ['[', TokenType.SquareBracket],
        [']', TokenType.SquareBracket],
        [',', TokenType.Comma],
        [';', TokenType.StatementSeparator],
    ]);

    /** Mapping of base characters to their respective numeric base. */
    private static readonly numberBases = new Map<string, number>([
        ['x', 16],
        ['b', 2],
        ['o', 8],
    ]);

    /** Lists all digits that are legal for a number in a given base */
    private static readonly digitsInBases = new Map<number, string>([
        [2, '01'],
        [8, '01234567'],
        [10, '0123456789'],
        [16, '0123456789ABCDEF'],
    ]);

    /** Set of keywords recognized by the tokenizer. */
    public static readonly keywords = new Set([
        'in', 'like', 'true', 'false', 'null', 'contains', 'matches',
        'rlike', 'irlike', 'regex', 'if', 'then', 'else', 'end',
    ]);

    /**
     * Converts the input string into a sequence of tokens.
     * 
     * @param input The input string to tokenize.
     * @returns An array of tokens ending with EndOfStream token.
     */
    public tokenize(input: string): Token[] {
        const tokens = [] as Token[];

        // Initialize the token variable with a dummy token.
        // Its position will make our parser start at the beginning of the input.
        // The actual type is not important here, as the parser will replace it immediately.
        let token = new Token(TokenType.EndOfStream, Token.EOF, 0, 0);

        do {
            token = this.getNextToken(input, token.startPosition + token.length);
            tokens.push(token);
        } while(token.type != TokenType.EndOfStream);

        return tokens;
    }

    /**
     * Returns the next token from the input string.
     * 
     * @param input The input string to tokenize.
     * @param startOffset The position in the input string to start searching for the next token.
     * @returns The next token in the input string.
     */
    protected getNextToken(input: string, startOffset: number): Token {
        // Skip comments first. Don't treat them as tokens at all.
        this.commentStartRegex.lastIndex = startOffset;
        while(this.commentStartRegex.test(input)) {
            // We found a comment start. Let's find the end of the comment.
            const commentEnd = input.indexOf('*/', this.commentStartRegex.lastIndex);
            if(commentEnd === -1) {
                // TODO: Decide on the error handling strategy.
                throw new Error('Unclosed comment');
            }
            startOffset = commentEnd + 2;
            this.commentStartRegex.lastIndex = startOffset;
        }

        // Skip whitespaces.
        while(startOffset < input.length && Tokenizer.whitespaces.includes(input[startOffset])) {
            startOffset++;
        }

        // If we reached the end of the input, return the EOF token.
        // Any further rules will not adjust startOffset, so we can safely do the check here.
        if(startOffset >= input.length) {
            return new Token(TokenType.EndOfStream, Token.EOF, startOffset, 0);
        }

        const firstChar = input[startOffset];

        // Punctuation
        const punctuationToken = Tokenizer.punctuationTokens.get(firstChar);
        if(punctuationToken !== undefined) {
            return new Token(punctuationToken, firstChar, startOffset, 1);
        }

        // String literals
        if(firstChar === '"' || firstChar === '\'') {
            return this.readStringLiteral(input, startOffset);
        }

        // Operators
        this.operatorsRegex.lastIndex = startOffset;
        const operatorMatch = this.operatorsRegex.exec(input);
        if(operatorMatch !== null) {
            return new Token(TokenType.Operator, operatorMatch[0], startOffset, operatorMatch[0].length);
        }

        // Numbers
        this.numberRegex.lastIndex = startOffset;
        const numberMatch = this.numberRegex.exec(input);
        if(numberMatch !== null) {
            const baseChar = numberMatch.groups?.base ?? 'd';
            const base = Tokenizer.numberBases.get(baseChar) ?? 10;
            const number = numberMatch.groups?.number ?? '0';
            const tokenLength = numberMatch[0].length;

            // TODO: Vulnerable to malformed data like `0xfa.07` or `0b23` (has to try/catch and throw)
            // TODO: Check if we need to parse non-decimal floats
            // TODO: Maybe abandon the complex regex and use simple parser like for strings
            // Checking for being NaN is needed, otherwise token `a` will be interpreted as
            // `0x0a` and not as an identifier
            if(number.indexOf('.') !== -1) {
                const numberValue = parseFloat(number);
                if(!isNaN(numberValue)) {
                    return new Token(TokenType.FloatLiteral, numberValue.toString(), startOffset, tokenLength);
                }
            } else {
                const numberValue = parseInt(number, base);
                if(!isNaN(numberValue)) {
                    return new Token(TokenType.IntLiteral, numberValue.toString(), startOffset, tokenLength);
                }
            }
        }

        // Identifiers and keywords
        this.identifierRegex.lastIndex = startOffset;
        const identifierMatch = this.identifierRegex.exec(input);
        if(identifierMatch !== null) {
            let identifier = identifierMatch[0];
            const tokenLength = identifier.length;

            const isKeyword = Tokenizer.keywords.has(identifier);
            const tokenType = isKeyword ? TokenType.Keyword : TokenType.Identifier;

            if (isKeyword) {
                // Identifiers are case-insensitive so normalize them to lowercase
                // We could also normalize the identifiers but it can make them unreadable
                identifier = identifier.toLowerCase();
            }

            return new Token(tokenType, identifier, startOffset, tokenLength);
        }

        return new Token(TokenType.EndOfStream, Token.EOF, startOffset, 0);
    }

    /**
     * Reads a string literal from the input string.
     * 
     * @param input The input string to read the string literal from.
     * @param startOffset The position in the input string to start reading the string literal from.
     * @returns The string literal token.
     */
    protected readStringLiteral(input: string, startOffset: number): Token {
        const quoteChar = input[startOffset];

        // Stores the parsed string content, i.e. `\n` will be stored as a newline character etc.
        let stringContent = '';

        let offset = startOffset + 1;
        while(offset < input.length) {
            const char = input[offset];
            if(char === quoteChar) {
                // The string ends here.
                // We calculate the token length by offsets in the input stream, because the string
                // content may not be the same length as the token in the input string
                // (eg. \n is two bytes in input).
                return new Token(TokenType.StringLiteral, stringContent, startOffset, offset - startOffset + 1);
            } else if(char === '\\') {
                if(offset + 1 >= input.length) {
                    // Unmatched escape at the end of the string
                    stringContent += '\\';
                    offset++;
                    break;
                } else {
                    const nextChar = input[offset + 1];
                    let escapeSequenceLength = 2;
                    switch(nextChar) {
                        case '\\':
                            stringContent += '\\';
                            break;
                        case 'n':
                            stringContent += '\n';
                            break;
                        case 'r':
                            stringContent += '\r';
                            break;
                        case 't':
                            stringContent += '\t';
                            break;
                        case quoteChar:
                            stringContent += quoteChar;
                            break;
                        case 'x':
                            // Ensure that the full `\xAB` sequence fits in the input string
                            if(offset + 3 < input.length) {
                                const charCode = input.substring(offset + 2, offset + 4);
                                if(/^[0-9A-F]{2}$/i.test(charCode)) {
                                    stringContent += String.fromCharCode(parseInt(charCode, 16));
                                    escapeSequenceLength = 4;
                                } else {
                                    stringContent += '\\x';
                                }
                            } else {
                                stringContent += '\\x';
                            }
                            break;

                        default:
                            stringContent += '\\' + nextChar;
                            break;
                    }
                    offset += escapeSequenceLength;
                }
            } else {
                // Copy the whole chunk without escape characters to the output variable.
                // chunkEnd is the exclusive end of the chunk.
                const nextBackslash = input.indexOf('\\', offset);
                const nextQuote = input.indexOf(quoteChar, offset);
                let chunkEnd = input.length;
                if(nextBackslash !== -1) chunkEnd = nextBackslash;
                if(nextQuote !== -1) chunkEnd = Math.min(chunkEnd, nextQuote);

                const chunk = input.substring(offset, chunkEnd);
                stringContent += chunk;
                offset = chunkEnd;
            }
        }

        // If we reached the end of the input, the string is unclosed.
        // TODO: Decide on the error handling strategy.
        throw new Error('Unclosed string literal');
    }
}