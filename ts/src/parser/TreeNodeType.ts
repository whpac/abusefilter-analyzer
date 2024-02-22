/**
 * An enumeration of all supported node types in the parser tree.
 * 
 * The order of the constants in this file is related to the order of parsing of nodes.
 * They are parsed from the top to bottom.
 * 
 * Note: there's no need to include Entry node type as it's always a single-element node and
 * the parser replaces it with its sole child.
 * 
 * Based on https://phabricator.wikimedia.org/diffusion/EABF/browse/master/includes/Parser/AFPTreeNode.php
 */
export enum TreeNodeType {
    /**
     * Represents a semicolon node. It's a node composed of many children and every of them
     * is separated with a semicolon. Its children are evaluated in order and the last value is returned.
     */
    Semicolon = 'Semicolon',


    /**
     * Represents an assignment node. It's composed of two children:
     * a variable name (string) and a value (tree node).
     */
    Assignment = 'Assignment',
    /**
     * Represents an assignment to an array element node. It's composed of three children:
     * a variable name (string), an index and a value (tree nodes).
     */
    IndexAssignment = 'IndexAssignment',
    /**
     * Represents an array append node. It's composed of two children:
     * a variable name (string) and a value (tree node).
     */
    ArrayAppend = 'ArrayAppend',


    /**
     * Represents a conditional node. It's composed of three children:
     * a condition, a value if the condition is true and a value if the condition is false.
     * All three children are tree nodes and but the last one can be unspecified if there's no else specified.
     * 
     * This type is applied to both ternary operator and if-then-else-end construct.
     */
    Conditional = 'Conditional',


    /**
     * Represents a logic operator node. It's composed of three children:
     * an operation (string), a left operand and a right operand (tree nodes).
     */
    Logic = 'Logic',


    /**
     * Represents a comparison operator node. It's composed of three children:
     * an operation (string), a left operand and a right operand (tree nodes).
     */
    Compare = 'Compare',


    /**
     * Represents an addition or subtraction operator node. It's composed of three children:
     * an operation (string), a left operand and a right operand (tree nodes).
     */
    ArithmeticAdditive = 'ArithmeticAdditive',


    /**
     * Represents a multiplication, division or modulo operator node. It's composed of three children:
     * an operation (string), a left operand and a right operand (tree nodes).
     */
    ArithmeticMultiplicative = 'ArithmeticMultiplicative',


    /**
     * Represents an exponentiation operator node. It's composed of two children:
     * a base and an exponent (tree nodes).
     */
    Exponentiation = 'Exponentiation',


    /**
     * Represents a boolean negation operator node. It's composed of a single child:
     * an operand (tree node).
     */
    BooleanNegation = 'BooleanNegation',


    /**
     * Represents a keyword binary operator node. It's composed of three children:
     * an operation (string), a left operand and a right operand (tree nodes).
     */
    KeywordOperator = 'KeywordOperator',


    /**
     * Represents an arithmetic unary operator node. It's composed of two children:
     * an operation (string) and an operand (tree node).
     */
    ArithmeticUnary = 'ArithmeticUnary',


    /**
     * Represents an array access by index node. It's composed of two children:
     * an array name (string) and an offset (tree node).
     */
    ArrayIndexing = 'ArrayIndexing',

    // Since parenthesis only manipulate precedence of the operators, they are
    // not explicitly represented in the tree.


    /**
     * Represents a function call node. It's composed of a function name (string) and
     * a variable number of further arguments (tree nodes).
     */
    FunctionCall = 'FunctionCall',


    /**
     * Represents an array definition node (i.e. array literal). It's composed of a
     * variable number of children, each of them is a value of a single array element (tree nodes).
     */
    ArrayDefinition = 'ArrayDefinition',


    /**
     * Represents a literal node. It's composed of a single child: a token.
     */
    Atom = 'Atom',
}