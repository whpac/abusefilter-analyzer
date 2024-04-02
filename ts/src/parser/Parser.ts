import { ParserException } from './ParserException.js';
import { Token } from './Token.js';
import { TokenType } from './TokenType.js';
import { TreeNode } from './nodes/TreeNode.js';
import { TreeNodeType } from './TreeNodeType.js';
import { NodeEvaluator } from '../evaluator/NodeEvaluator.js';
import { INodeFactory } from './nodes/INodeFactory.js';

/**
 * A parser for the AbuseFilter syntax.
 * 
 * Based on https://phabricator.wikimedia.org/diffusion/EABF/browse/master/includes/Parser/AFPTreeParser.php
 */
export class Parser {
    private nodeFactory: INodeFactory;

    /** Stores the sequence of tokens that the parser is currently processing. */
    private tokens: Token[] = [];

    /** The current token */
    private currentToken: Token = new Token(TokenType.EndOfStream, Token.EOF, 0, 0);

    /** The position of the current token */
    private mPos: number = -1; // -1 so that the first call to move() sets it to 0
    // TODO: It'd be better to use some Queue<Token> like structure to avoid using mPos and mCur

    public constructor(nodeFactory: INodeFactory) {
        this.nodeFactory = nodeFactory;
    }

    /**
     * Parses a list of AbuseFilter tokens into an expression tree.
     * 
     * @param tokens The tokens to parse.
     * @returns The parsed expression tree.
     */
    public parse(tokens: Token[]): TreeNode {
        this.tokens = tokens;
        const tree = this.doLevelEntry();

        if (tree === null) {
            // When the filter is empty, return a null token instead of no tree at all.
            // AbuseFilter evaluates empty tree to null, so this is a valid representation.
            return this.nodeFactory.createAtomNode(new Token(TokenType.Keyword, 'null', 0, 0));
        }
        return tree;
    }

    /**
     * Advances the parser to the next token in the filter code.
     */
    private move(): void {
        this.mPos++;
        this.currentToken = this.tokens[this.mPos];
    }

    /**
     * Get the next token. This is similar to move() but doesn't change class members,
     *   allowing to look ahead without rolling back the state.
     */
    private getNextToken(): Token {
        return this.tokens[this.mPos + 1];
    }

    /**
     * getState() function allows parser state to be rollbacked to several tokens
     * back.
     *
     * @return AFPParserState
     */
    private getState(): [Token, number] {
        return [this.currentToken, this.mPos];
    }

    /**
     * setState() function allows parser state to be rollbacked to several tokens
     * back.
     * TODO: This should not be needed at all
     * @param AFPParserState state
     */
    private setState(state: [Token, number]) {
        this.currentToken = state[0];
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
        if(this.currentToken.type !== TokenType.EndOfStream) {
            throw new ParserException(
                'unexpectedatend',
                this.currentToken.startPosition, [this.currentToken.type]
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
            position = this.currentToken.startPosition;

            if(
                this.currentToken.type === TokenType.EndOfStream ||
                (this.currentToken.type === TokenType.Parenthesis && this.currentToken.value == ')')
            ) {
                // Handle special cases which the other parser handled in doLevelAtom
                break;
            }

            // Allow empty statements.
            if(this.currentToken.type === TokenType.StatementSeparator) {
                continue;
            }

            statements.push(this.doLevelSet());
            position = this.currentToken.startPosition;
        } while(this.currentToken.type === TokenType.StatementSeparator);

        // Flatten the tree if possible.
        if(statements.length === 0) {
            return null;
        } else if(statements.length === 1) {
            return statements[0];
        } else {
            return this.nodeFactory.createOperatorNode(TreeNodeType.Semicolon, position, ';', statements);
        }
    }

    /** Handles variable assignment. */
    private doLevelSet(): TreeNode {
        if(this.currentToken.type === TokenType.Identifier) {
            const variableNode = this.nodeFactory.createAtomNode(this.currentToken);

            // Speculatively parse the assignment statement assuming it can
            // potentially be an assignment, but roll back if it isn't.
            // @todo Use this.getNextToken for clearer code
            const initialState = this.getState();
            this.move();

            if(this.currentToken.is(TokenType.Operator, ':=')) {
                const position = this.currentToken.startPosition;
                this.move();
                const value = this.doLevelSet();

                return this.nodeFactory.createOperatorNode(
                    TreeNodeType.Assignment, position, ':=', [variableNode, value]
                );
            }

            if(this.currentToken.is(TokenType.SquareBracket, '[')) {
                this.move();

                // Parse index offset.
                let index: TreeNode | 'append' | null = 'append';
                if(!(this.currentToken.is(TokenType.SquareBracket, ']'))) {
                    this.setState(initialState);
                    this.move();
                    index = this.doLevelSemicolon();
                    if(!this.currentToken.is(TokenType.SquareBracket, ']')) {
                        this.throwExpectedNotFound(this.currentToken, ']');
                    }
                }

                this.move();
                if(this.currentToken.is(TokenType.Operator, ':=')) {
                    const position = this.currentToken.startPosition;
                    this.move();
                    const value = this.doLevelSet();

                    if(index === 'append') {
                        return this.nodeFactory.createOperatorNode(
                            TreeNodeType.ArrayAppend, position, '[] :=', [variableNode, value]
                        );
                    } else {
                        // TODO: index could be null, but the original parser acts this way
                        return this.nodeFactory.createOperatorNode(
                            TreeNodeType.IndexAssignment, position, '[_] :=', [variableNode, index!, value]
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
        if(this.currentToken.is(TokenType.Keyword, 'if')) {
            const position = this.currentToken.startPosition;
            this.move();
            const condition = this.doLevelBoolOps();

            if(!this.currentToken.is(TokenType.Keyword, 'then')) {
                this.throwExpectedNotFound(this.currentToken, 'then');
            }
            this.move();

            const valueIfTrue = this.doLevelConditions();
            const args = [condition, valueIfTrue];
            
            if(this.currentToken.is(TokenType.Keyword, 'else')) {
                this.move();

                const valueIfFalse = this.doLevelConditions();
                args.push(valueIfFalse);
            }

            if(!this.currentToken.is(TokenType.Keyword, 'end')) {
                this.throwExpectedNotFound(this.currentToken, 'end');
            }
            this.move();

            return this.nodeFactory.createOperatorNode(TreeNodeType.Conditional, position, '?:', args);
        }

        const condition = this.doLevelBoolOps();
        if(this.currentToken.is(TokenType.Operator, '?')) {
            const position = this.currentToken.startPosition;
            this.move();

            const valueIfTrue = this.doLevelConditions();
            if(!this.currentToken.is(TokenType.Operator, ':')) {
                this.throwExpectedNotFound(this.currentToken, ':');
            }
            this.move();

            const valueIfFalse = this.doLevelConditions();
            return this.nodeFactory.createOperatorNode(
                TreeNodeType.Conditional,
                position,
                '?:',
                [condition, valueIfTrue, valueIfFalse],
            );
        }

        return condition;
    }

    /** Handles logic operators. */
    private doLevelBoolOps(): TreeNode {
        let leftOperand = this.doLevelCompares();
        const ops = ['&', '|', '^'];
        while(this.currentToken.is(TokenType.Operator, ops)) {
            const op = this.currentToken.value;
            const position = this.currentToken.startPosition;
            this.move();

            const rightOperand = this.doLevelCompares();

            leftOperand = this.nodeFactory.createOperatorNode(
                TreeNodeType.Logic,
                position,
                op,
                [leftOperand, rightOperand],
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
        while(this.currentToken.is(TokenType.Operator, allowedOps)) {
            const op = this.currentToken.value;
            allowedOps = equalityOps.includes(op) ? orderOps : equalityOps;
            const position = this.currentToken.startPosition;
            this.move();
            const rightOperand = this.doLevelSumRels();
            leftOperand = this.nodeFactory.createOperatorNode(
                TreeNodeType.Compare,
                position,
                op,
                [leftOperand, rightOperand],
            );
        }
        return leftOperand;
    }

    /** Handle addition and subtraction. */
    private doLevelSumRels(): TreeNode {
        let leftOperand = this.doLevelMulRels();
        const ops = ['+', '-'];
        while(this.currentToken.is(TokenType.Operator, ops)) {
            const op = this.currentToken.value;
            const position = this.currentToken.startPosition;
            this.move();
            const rightOperand = this.doLevelMulRels();
            leftOperand = this.nodeFactory.createOperatorNode(
                TreeNodeType.ArithmeticAdditive,
                position,
                op,
                [leftOperand, rightOperand],
            );
        }
        return leftOperand;
    }

    /** Handles multiplication and division. */
    private doLevelMulRels(): TreeNode {
        let leftOperand = this.doLevelPow();
        const ops = ['*', '/', '%'];
        while(this.currentToken.is(TokenType.Operator, ops)) {
            const op = this.currentToken.value;
            const position = this.currentToken.startPosition;
            this.move();
            const rightOperand = this.doLevelPow();
            leftOperand = this.nodeFactory.createOperatorNode(
                TreeNodeType.ArithmeticMultiplicative,
                position,
                op,
                [leftOperand, rightOperand],
            );
        }
        return leftOperand;
    }

    /** Handles exponentiation. */
    private doLevelPow(): TreeNode {
        let base = this.doLevelBoolInvert();
        while(this.currentToken.is(TokenType.Operator, '**')) {
            const position = this.currentToken.startPosition;
            this.move();
            const exponent = this.doLevelBoolInvert();
            base = this.nodeFactory.createOperatorNode(TreeNodeType.Exponentiation, position, '**', [base, exponent]);
        }
        return base;
    }

    /** Handles boolean inversion. */
    private doLevelBoolInvert(): TreeNode {
        if(this.currentToken.is(TokenType.Operator, '!')) {
            const position = this.currentToken.startPosition;
            this.move();
            const argument = this.doLevelKeywordOperators();
            return this.nodeFactory.createOperatorNode(TreeNodeType.BooleanNegation, position, '!', [argument]);
        }

        return this.doLevelKeywordOperators();
    }

    /** Handles keyword operators. */
    private doLevelKeywordOperators(): TreeNode {
        const leftOperand = this.doLevelUnarys();
        const keyword = this.currentToken.value.toLowerCase();
        const availableKeywords: string[] = NodeEvaluator.operatorKeywords;
        if(this.currentToken.is(TokenType.Keyword, availableKeywords)) {
            const position = this.currentToken.startPosition;
            this.move();
            const rightOperand = this.doLevelUnarys();

            return this.nodeFactory.createOperatorNode(
                TreeNodeType.KeywordOperator,
                position,
                keyword,
                [leftOperand, rightOperand],
            );
        }

        return leftOperand;
    }

    /** Handles unary operators. */
    private doLevelUnarys(): TreeNode {
        const op = this.currentToken.value;
        if(this.currentToken.is(TokenType.Operator, ['+', '-'])) {
            const position = this.currentToken.startPosition;
            this.move();
            const argument = this.doLevelArrayElements();
            return this.nodeFactory.createOperatorNode(TreeNodeType.ArithmeticUnary, position, op, [argument]);
        }
        return this.doLevelArrayElements();
    }

    /** Handles accessing an array element by an offset. */
    private doLevelArrayElements(): TreeNode {
        let array = this.doLevelParenthesis();
        while(this.currentToken.is(TokenType.SquareBracket, '[')) {
            const position = this.currentToken.startPosition;
            const index = this.doLevelSemicolon()!; // TODO: index could be null, but the original parser acts this way
            array = this.nodeFactory.createOperatorNode(TreeNodeType.ArrayIndexing, position, '[]', [array, index]);

            if(!this.currentToken.is(TokenType.SquareBracket, ']')) {
                this.throwExpectedNotFound(this.currentToken, ']');
            }
            this.move();
        }

        return array;
    }

    /** Handles parenthesis. */
    private doLevelParenthesis(): TreeNode {
        if(this.currentToken.is(TokenType.Parenthesis, '(')) {
            const next = this.getNextToken();
            if(next.is(TokenType.Parenthesis, ')')) {
                // Empty parentheses are never allowed
                this.throwUnexpectedToken(this.currentToken);
            }
            const result = this.doLevelSemicolon() as TreeNode; // TODO: result could be null, but the original parser acts this way

            if(!this.currentToken.is(TokenType.Parenthesis, ')')) {
                this.throwExpectedNotFound( this.currentToken, ')');
            }
            this.move();

            return result;
        }

        return this.doLevelFunction();
    }

    /** Handles function calls. */
    private doLevelFunction(): TreeNode {
        let next = this.getNextToken();
        if(this.currentToken.type === TokenType.Identifier && next.is(TokenType.Parenthesis, '(')) {
            const func = this.currentToken.value;
            const position = this.currentToken.startPosition;
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
                        this.throwUnexpectedToken(this.currentToken);
                    }
                } while(this.currentToken.is(TokenType.Comma));
            } else {
                this.move();
            }

            if(!this.currentToken.is(TokenType.Parenthesis, ')')) {
                this.throwExpectedNotFound(this.currentToken, ')');
            }
            this.move();

            return this.nodeFactory.createOperatorNode(TreeNodeType.FunctionCall, position, func, args);
        }

        return this.doLevelAtom();
    }

    /** Handle literals. */
    private doLevelAtom(): TreeNode {
        const tok = this.currentToken.value;
        let result: TreeNode;
        switch(this.currentToken.type) {
            case TokenType.Identifier:
            case TokenType.StringLiteral:
            case TokenType.FloatLiteral:
            case TokenType.IntLiteral:
                result = this.nodeFactory.createAtomNode(this.currentToken);
                break;
            case TokenType.Keyword:
                if(['true', 'false', 'null'].includes(tok)) {
                    result = this.nodeFactory.createAtomNode(this.currentToken);
                    break;
                }

                throw new ParserException(
                    'unrecognisedkeyword',
                    this.currentToken.startPosition,
                    [tok]
                );

            case TokenType.SquareBracket:
                if(this.currentToken.value === '[') {
                    const array = [];

                    // eslint-disable-next-line no-constant-condition
                    while(true) {
                        this.move();
                        if(this.currentToken.is(TokenType.SquareBracket, ']')) {
                            break;
                        }

                        array.push(this.doLevelSet());

                        if(this.currentToken.is(TokenType.SquareBracket, ']')) {
                            break;
                        }
                        if(!this.currentToken.is(TokenType.Comma)) {
                            this.throwExpectedNotFound(this.currentToken, ', or ]');
                        }
                    }

                    result = this.nodeFactory.createOperatorNode(TreeNodeType.ArrayDefinition, this.currentToken.startPosition, '[]', array);
                    break;
                }

            // Fallthrough expected
            default:
                this.throwUnexpectedToken(this.currentToken);
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
     * @param currentToken The unexpected token.
     */
    private throwUnexpectedToken(currentToken: Token): never {
        throw new ParserException(
            'unexpectedtoken',
            currentToken.startPosition,
            [
                currentToken.type,
                currentToken.value
            ]
        );
    }

    /**
     * Throws an exception stating that an expected token was not found.
     * @param currentToken The current token.
     * @param expected The expected token.
     */
    private throwExpectedNotFound(currentToken: Token, expected: string): never {
        throw new ParserException(
            'expectednotfound',
            currentToken.startPosition,
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