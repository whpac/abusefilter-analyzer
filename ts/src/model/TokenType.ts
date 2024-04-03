export enum TokenType {
    /** A special type of token designating an end of the input stream. */
    EndOfStream = 'EndOfStream',

    /** A variable or function name. */
    Identifier = 'Identifier',
    /** A reserved word like `in` or `rlike`. */
    Keyword = 'Keyword',

    /** String literal enclosed in quotes or apostrophes. */
    StringLiteral = 'StringLiteral',
    /** Whole number literal; decimal, hexadecimal, octal or binary. */
    IntLiteral = 'IntLiteral',
    /** Literal for a number with fractional part. */
    FloatLiteral = 'FloatLiteral',

    /** One of the operators like `+` or `>=`. */
    Operator = 'Operator',

    /** Left or right parenthesis: `(` or `)`. */
    Parenthesis = 'Parenthesis',
    /** Left or right bracket: `[` or `]`. */
    SquareBracket = 'SquareBracket',

    /** A comma `,`. */
    Comma = 'Comma',
    /** A semicolon `;`. */
    StatementSeparator = 'StatementSeparator',
}