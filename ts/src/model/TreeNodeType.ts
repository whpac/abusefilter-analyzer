/**
 * An enumeration of all supported node types in the parser tree.
 */
export enum TreeNodeType {
    /**
     * Represents an operator node. It's composed of one to three children that represent
     * the operands.
     */
    Operator = 'Operator',

    /**
     * Represents an assignment node. It's composed of two children:
     * a variable name (string) and a value (tree node).
     */
    Assignment = 'Assignment',

    /**
     * Represents an assignment to an array element node. It's composed of three subnodes:
     * a variable, a value and optionally an index (without index it's appending to array).
     */
    IndexAssignment = 'IndexAssignment',

    /**
     * Represents an array access by index node. It's composed of two children:
     * an array and an offset (both being tree nodes).
     */
    ArrayIndexing = 'ArrayIndexing',

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