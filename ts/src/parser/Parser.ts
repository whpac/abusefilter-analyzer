import { ParserException } from './ParserException.js';
import { Token } from './Token.js';
import { TokenType } from './TokenType.js';
import { Tokenizer } from './Tokenizer.js';
import { TreeNode } from './TreeNode.js';
import { TreeNodeType } from './TreeNodeType.js';

/**
 * A parser for the AbuseFilter syntax.
 * 
 * Based on https://phabricator.wikimedia.org/diffusion/EABF/browse/master/includes/Parser/AFPTreeParser.php
 */
export class Parser {
    /** Stores the sequence of tokens that the parser is currently processing. */
    private mTokens: Token[] = [];

    /** The current token */
    private mCur: Token;

    /** The position of the current token */
    private mPos: number = -1; // TODO: Analyze how it's used; -1 so that the first call to move() sets it to 0
    // TODO: It'd be better to use some Queue<Token> like structure to avoid using mPos and mCur

    /**
     * Parses a list of AbuseFilter tokens into an expression tree.
     * 
     * @param tokens The tokens to parse.
     * @returns The parsed expression tree.
     */
    public parse(tokens: Token[]): TreeNode | null {
        this.mTokens = tokens;

        return this.doLevelEntry();
    }

    /**
     * Advances the parser to the next token in the filter code.
     */
    private move(): void {
        this.mPos++;
        this.mCur = this.mTokens[this.mPos];
    }

    /**
     * Get the next token. This is similar to move() but doesn't change class members,
     *   allowing to look ahead without rolling back the state.
     *
     * @return AFPToken
     */
    private getNextToken(): Token {
        return this.mTokens[this.mPos + 1];
    }

    /**
     * getState() function allows parser state to be rollbacked to several tokens
     * back.
     *
     * @return AFPParserState
     */
    private getState(): [Token, number] {
        return [this.mCur, this.mPos];
    }

    /**
     * setState() function allows parser state to be rollbacked to several tokens
     * back.
     * TODO: This should not be needed at all
     * @param AFPParserState state
     */
    private setState(state: [Token, number]) {
        this.mCur = state[0];
        this.mPos = state[1];
    }

    /* Levels */

    /**
     * Handles unexpected characters after the expression.
     * @returns Null only if no statements
     */
    private doLevelEntry(): TreeNode | null {
        const result = this.doLevelSemicolon();

        // At the top level, the filter consists of a single expression.
        // Thus, the only legal token to be found later is the end of the stream.
        if(this.mCur.type !== TokenType.EndOfStream) {
            throw new ParserException(
                'unexpectedatend',
                this.mPos, [this.mCur.type]
            );
        }

        return result;
    }

    /** Handles the semicolon operator. */
    private doLevelSemicolon(): TreeNode | null {
        const statements: TreeNode[] = [];
        let position = 0;

        do {
            this.move();
            position = this.mPos;

            if(
                this.mCur.type === TokenType.EndOfStream ||
                (this.mCur.type === TokenType.Parenthesis && this.mCur.value == ')')
            ) {
                // Handle special cases which the other parser handled in doLevelAtom
                break;
            }

            // Allow empty statements.
            if(this.mCur.type === TokenType.StatementSeparator) {
                continue;
            }

            statements.push(this.doLevelSet());
            position = this.mPos;
        } while(this.mCur.type === TokenType.StatementSeparator);

        // Flatten the tree if possible.
        if(statements.length === 0) {
            return null;
        } else if(statements.length === 1) {
            return statements[0];
        } else {
            return new TreeNode(TreeNodeType.Semicolon, statements, position);
        }
    }

    /** Handles variable assignment. */
    private doLevelSet(): TreeNode {
        if(this.mCur.type === TokenType.Identifier) {
            const varname = this.mCur.value;

            // Speculatively parse the assignment statement assuming it can
            // potentially be an assignment, but roll back if it isn't.
            // @todo Use this.getNextToken for clearer code
            const initialState = this.getState();
            this.move();

            if(this.mCur.is(TokenType.Operator, ':=')) {
                const position = this.mPos;
                this.move();
                const value = this.doLevelSet();

                return new TreeNode(TreeNodeType.Assignment, [varname, value], position);
            }

            if(this.mCur.is(TokenType.SquareBracket, '[')) {
                this.move();

                // Parse index offset.
                let index: TreeNode | 'append' | null = 'append';
                if(!(this.mCur.is(TokenType.SquareBracket, ']'))) {
                    this.setState(initialState);
                    this.move();
                    index = this.doLevelSemicolon();
                    if(!this.mCur.is(TokenType.SquareBracket, ']')) {
                        this.throwExpectedNotFound(this.mPos, this.mCur, ']');
                    }
                }

                this.move();
                if(this.mCur.is(TokenType.Operator, ':=')) {
                    const position = this.mPos;
                    this.move();
                    const value = this.doLevelSet();

                    if(index === 'append') {
                        return new TreeNode(
                            TreeNodeType.ArrayAppend, [varname, value], position);
                    } else {
                        return new TreeNode(
                            TreeNodeType.IndexAssignment,
                            [varname, index!, value], // TODO: index could be null, but the original parser acts this way
                            position
                        );
                    }
                }
            }

            // If we reached this point, we did not find an assignment.  Roll back
            // and assume this was just a literal.
            this.setState(initialState);
        }

        return this.doLevelConditions();
    }

    /** Handles ternary operator and if-then-else-end. */
    private doLevelConditions(): TreeNode {
        if(this.mCur.is(TokenType.Keyword, 'if')) {
            const position = this.mPos;
            this.move();
            const condition = this.doLevelBoolOps();

            if(!this.mCur.is(TokenType.Keyword, 'then')) {
                this.throwExpectedNotFound(this.mPos, this.mCur, 'then');
            }
            this.move();

            const valueIfTrue = this.doLevelConditions();
            let valueIfFalse = null;

            if(this.mCur.is(TokenType.Keyword, 'else')) {
                this.move();
                valueIfFalse = this.doLevelConditions();
            }

            if(!this.mCur.is(TokenType.Keyword, 'end')) {
                this.throwExpectedNotFound(this.mPos, this.mCur, 'end');
            }
            this.move();

            return new TreeNode(
                TreeNodeType.Conditional,
                [condition, valueIfTrue, valueIfFalse],
                position
            );
        }

        const condition = this.doLevelBoolOps();
        if(this.mCur.is(TokenType.Operator, '?')) {
            const position = this.mPos;
            this.move();

            const valueIfTrue = this.doLevelConditions();
            if(!this.mCur.is(TokenType.Operator, ':')) {
                this.throwExpectedNotFound(this.mPos, this.mCur, ':');
            }
            this.move();

            const valueIfFalse = this.doLevelConditions();
            return new TreeNode(
                TreeNodeType.Conditional,
                [condition, valueIfTrue, valueIfFalse],
                position
            );
        }

        return condition;
    }

    /** Handles logic operators. */
    private doLevelBoolOps(): TreeNode {
        let leftOperand = this.doLevelCompares();
        const ops = ['&', '|', '^'];
        while(this.mCur.is(TokenType.Operator, ops)) {
            const op = this.mCur.value;
            const position = this.mPos;
            this.move();

            const rightOperand = this.doLevelCompares();

            leftOperand = new TreeNode(
                TreeNodeType.Logic,
                [op, leftOperand, rightOperand],
                position
            );
        }
        return leftOperand;
    }

    /** Handles comparison operators. */
    private doLevelCompares(): TreeNode {
        let leftOperand = this.doLevelSumRels();
        const equalityOps = ['==', '===', '!=', '!==', '='];
        const orderOps = ['<', '>', '<=', '>='];
        // Only allow either a single operation, or a combination of a single equalityOps and a single
        // orderOps. This resembles what PHP does, and allows `a < b == c` while rejecting `a < b < c`
        let allowedOps = equalityOps.concat(orderOps);
        while(this.mCur.is(TokenType.Operator, allowedOps)) {
            const op = this.mCur.value;
            allowedOps = equalityOps.includes(op) ? orderOps : equalityOps;
            const position = this.mPos;
            this.move();
            const rightOperand = this.doLevelSumRels();
            leftOperand = new TreeNode(
                TreeNodeType.Compare,
                [op, leftOperand, rightOperand],
                position
            );
        }
        return leftOperand;
    }

    /** Handle addition and subtraction. */
    private doLevelSumRels(): TreeNode {
        let leftOperand = this.doLevelMulRels();
        const ops = ['+', '-'];
        while(this.mCur.is(TokenType.Operator, ops)) {
            const op = this.mCur.value;
            const position = this.mPos;
            this.move();
            const rightOperand = this.doLevelMulRels();
            leftOperand = new TreeNode(
                TreeNodeType.ArithmeticAdditive,
                [op, leftOperand, rightOperand],
                position
            );
        }
        return leftOperand;
    }

    /** Handles multiplication and division. */
    private doLevelMulRels(): TreeNode {
        let leftOperand = this.doLevelPow();
        const ops = ['*', '/', '%'];
        while(this.mCur.is(TokenType.Operator, ops)) {
            const op = this.mCur.value;
            const position = this.mPos;
            this.move();
            const rightOperand = this.doLevelPow();
            leftOperand = new TreeNode(
                TreeNodeType.ArithmeticMultiplicative,
                [op, leftOperand, rightOperand],
                position
            );
        }
        return leftOperand;
    }

    /** Handles exponentiation. */
    private doLevelPow(): TreeNode {
        let base = this.doLevelBoolInvert();
        while(this.mCur.is(TokenType.Operator, '**')) {
            const position = this.mPos;
            this.move();
            const exponent = this.doLevelBoolInvert();
            base = new TreeNode(TreeNodeType.Exponentiation, [base, exponent], position);
        }
        return base;
    }

    /** Handles boolean inversion. */
    private doLevelBoolInvert(): TreeNode {
        if(this.mCur.is(TokenType.Operator, '!')) {
            const position = this.mPos;
            this.move();
            const argument = this.doLevelKeywordOperators();
            return new TreeNode(TreeNodeType.BooleanNegation, [argument], position);
        }

        return this.doLevelKeywordOperators();
    }

    /** Handles keyword operators. */
    private doLevelKeywordOperators(): TreeNode {
        const leftOperand = this.doLevelUnarys();
        const keyword = this.mCur.value.toLowerCase();
        const availableKeywords: string[] = Array.from(Tokenizer.keywords);
        if(this.mCur.is(TokenType.Keyword, availableKeywords)) {
            const position = this.mPos;
            this.move();
            const rightOperand = this.doLevelUnarys();

            return new TreeNode(
                TreeNodeType.KeywordOperator,
                [keyword, leftOperand, rightOperand],
                position
            );
        }

        return leftOperand;
    }

    /** Handles unary operators. */
    private doLevelUnarys(): TreeNode {
        const op = this.mCur.value;
        if(this.mCur.is(TokenType.Operator, ['+', '-'])) {
            const position = this.mPos;
            this.move();
            const argument = this.doLevelArrayElements();
            return new TreeNode(TreeNodeType.ArithmeticUnary, [op, argument], position);
        }
        return this.doLevelArrayElements();
    }

    /** Handles accessing an array element by an offset. */
    private doLevelArrayElements(): TreeNode {
        let array = this.doLevelParenthesis();
        while(this.mCur.is(TokenType.SquareBracket, '[')) {
            const position = this.mPos;
            const index = this.doLevelSemicolon()!; // TODO: index could be null, but the original parser acts this way
            array = new TreeNode(TreeNodeType.ArrayIndexing, [array, index], position);

            if(!this.mCur.is(TokenType.SquareBracket, ']')) {
                this.throwExpectedNotFound(this.mPos, this.mCur, ']');
            }
            this.move();
        }

        return array;
    }

    /** Handles parenthesis. */
    private doLevelParenthesis(): TreeNode {
        if(this.mCur.is(TokenType.Parenthesis, '(')) {
            const next = this.getNextToken();
            if(next.is(TokenType.Parenthesis, ')')) {
                // Empty parentheses are never allowed
                this.throwUnexpectedToken(this.mPos, this.mCur);
            }
            const result = this.doLevelSemicolon() as TreeNode; // TODO: result could be null, but the original parser acts this way

            if(!this.mCur.is(TokenType.Parenthesis, ')')) {
                this.throwExpectedNotFound(this.mPos, this.mCur, ')');
            }
            this.move();

            return result;
        }

        return this.doLevelFunction();
    }

    /** Handles function calls. */
    private doLevelFunction(): TreeNode {
        let next = this.getNextToken();
        if(this.mCur.type === TokenType.Identifier && next.is(TokenType.Parenthesis, '(')) {
            const func = this.mCur.value;
            const position = this.mPos;
            this.move();

            const args: TreeNode[] = [];
            next = this.getNextToken();
            if(!next.is(TokenType.Parenthesis, ')')) {
                do {
                    const thisArg = this.doLevelSemicolon();
                    if(thisArg !== null) {
                        args.push(thisArg);
                    } else if(!this.functionIsVariadic(func)) {
                        // TODO: Figure out if we need this condition
                        this.throwUnexpectedToken(this.mPos, this.mCur);
                    }
                } while(this.mCur.type === TokenType.Comma);
            } else {
                this.move();
            }

            if(!this.mCur.is(TokenType.Parenthesis, ')')) {
                this.throwExpectedNotFound(this.mPos, this.mCur, ')');
            }
            this.move();

            return new TreeNode(TreeNodeType.FunctionCall, [func, ...args], position);
        }

        return this.doLevelAtom();
    }

    /** Handle literals. */
    private doLevelAtom(): TreeNode {
        const tok = this.mCur.value;
        let result: TreeNode;
        switch(this.mCur.type) {
            case TokenType.Identifier:
            case TokenType.StringLiteral:
            case TokenType.FloatLiteral:
            case TokenType.IntLiteral:
                result = new TreeNode(TreeNodeType.Atom, this.mCur, this.mPos);
                break;
            case TokenType.Keyword:
                if(['true', 'false', 'null'].includes(tok)) {
                    result = new TreeNode(TreeNodeType.Atom, this.mCur, this.mPos);
                    break;
                }

                throw new ParserException(
                    'unrecognisedkeyword',
                    this.mPos,
                    [tok]
                );

            case TokenType.SquareBracket:
                if(this.mCur.value === '[') {
                    const array = [];
                    while(true) {
                        this.move();
                        if(this.mCur.is(TokenType.SquareBracket, ']')) {
                            break;
                        }

                        array.push(this.doLevelSet());

                        if(this.mCur.is(TokenType.SquareBracket, ']')) {
                            break;
                        }
                        if(this.mCur.type !== TokenType.Comma) {
                            this.throwExpectedNotFound(this.mPos, this.mCur, ', or ]');
                        }
                    }

                    result = new TreeNode(TreeNodeType.ArrayDefinition, array, this.mPos);
                    break;
                }

            // Fallthrough expected
            default:
                this.throwUnexpectedToken(this.mPos, this.mCur);
        }

        this.move();
        return result;
    }

    /**
     * Checks if the given function is variadic.
     * @param fname Function name
     */
    private functionIsVariadic(fname: string): boolean {
        return true;
        /*
        // TODO
        if ( !array_key_exists( fname, FilterEvaluator::FUNC_ARG_COUNT ) ) {
            // @codeCoverageIgnoreStart
            throw new InvalidArgumentException( "Function fname is not valid" );
            // @codeCoverageIgnoreEnd
        }
        return FilterEvaluator::FUNC_ARG_COUNT[fname][1] === INF;*/
    }

    /**
     * Throws an exception stating that the found token was not expected
     * @param position The position of the unexpected token.
     * @param currentToken The unexpected token.
     */
    private throwUnexpectedToken(position: number, currentToken: Token): never {
        throw new ParserException(
            'unexpectedtoken',
            position,
            [
                currentToken.type,
                currentToken.value
            ]
        );
    }

    /**
     * Throws an exception stating that an expected token was not found.
     * @param position The position of the current token.
     * @param currentToken The current token.
     * @param expected The expected token.
     */
    private throwExpectedNotFound(position: number, currentToken: Token, expected: string): never {
        throw new ParserException(
            'expectednotfound',
            position,
            [
                expected,
                currentToken.type,
                currentToken.value
            ]
        );
    }
}

/*
Parsing levels:
0. Entry
1. Semicolon-separated statements
2. Assignments
3. Conditions
4. Logical operators
5. Comparison operators
6. Arithmetic operators (addition)
7. Arithmetic operators (multiplication)
8. Arithmetic operators (exponentiation)
9. Boolean negation
10. Keyword operators
11. Unary arithmetic operators
12. Array indexing
13. Parentheses
14. Function calls
15. Atoms (literals, variables)
*/