import { Token } from './Token.js';
import { TokenType } from './TokenType.js';

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

    /** Set of keywords recognized by the tokenizer. */
    private static readonly keywords = new Set([
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
        let token = new Token(TokenType.EndOfStream, null, 0, 0);

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
        }

        // Skip whitespaces.
        while(startOffset < input.length && Tokenizer.whitespaces.includes(input[startOffset])) {
            startOffset++;
        }

        // If we reached the end of the input, return the EOF token.
        // Any further rules will not adjust startOffset, so we can safely do the check here.
        if(startOffset >= input.length) {
            return new Token(TokenType.EndOfStream, null, startOffset, 0);
        }

        const firstChar = input[startOffset];

        // Punctuation
        const punctuationToken = Tokenizer.punctuationTokens.get(firstChar);
        if(punctuationToken !== undefined) {
            return new Token(punctuationToken, firstChar, startOffset, 1);
        }

        // String literals
        if(firstChar === '"' || firstChar === '\'') {
            // TODO: Delegate to a separate function to process escape sequences.
            // It's broken now, will treat \ literally and not as an escape
            const endQuote = input.indexOf(firstChar, startOffset + 1);
            if(endQuote === -1) {
                // TODO: Decide on the error handling strategy.
                throw new Error(`Unclosed string literal. Starting offset: ${startOffset}`);
            }

            // Exclude the quotes from the string
            const stringContent = input.substring(startOffset + 1, endQuote);
            return new Token(TokenType.StringLiteral, stringContent, startOffset, stringContent.length + 2);
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
            if(number.indexOf('.') !== -1) {
                const numberValue = parseFloat(number);
                return new Token(TokenType.FloatLiteral, numberValue.toString(), startOffset, tokenLength);
            } else {
                const numberValue = parseInt(number, base);
                return new Token(TokenType.IntLiteral, numberValue.toString(), startOffset, tokenLength);
            }
        }

        // Identifiers and keywords
        this.identifierRegex.lastIndex = startOffset;
        const identifierMatch = this.identifierRegex.exec(input);
        if(identifierMatch !== null) {
            const identifier = identifierMatch[0];
            const tokenLength = identifier.length;

            const isKeyword = Tokenizer.keywords.has(identifier);
            const tokenType = isKeyword ? TokenType.Keyword : TokenType.Identifier;

            return new Token(tokenType, identifier, startOffset, tokenLength);
        }

        return new Token(TokenType.EndOfStream, null, startOffset, 0);
    }
}