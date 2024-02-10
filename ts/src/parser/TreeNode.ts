import { Token } from './Token.js';
import { TreeNodeType } from './TreeNodeType.js';

/**
 * Represents a single node in the parser tree. It chan contain other nodes or simple values.
 * 
 * Based on https://phabricator.wikimedia.org/diffusion/EABF/browse/master/includes/Parser/AFPTreeNode.php
 */
export class TreeNode {

    /** Type of this node */
    public type: TreeNodeType;

    /**
     * Parameters for the node. For atoms it's a single Token, while for other nodes
     * it's an array of other TreeNodes or strings. The precise structure depends on the node type
     * and is reflected in the constructor signatures.
     */
    public children: (TreeNode | string | null)[] | Token;

    /**
     * The position of the node in the source code, used for error reporting.
     */
    public position: number;

    public constructor(type: TypesWithManyNodeChildren, children: TreeNode[], position: number);
    public constructor(type: TypesWithStringAndSingleNode, children: [string, TreeNode], position: number);
    public constructor(type: TypesWithStringAndTwoNodes, children: [string, TreeNode, TreeNode], position: number);
    public constructor(type: TypesWithTwoNodes, children: [TreeNode, TreeNode], position: number);
    public constructor(type: TypesWithStringAndManyNodes, children: [string, ...TreeNode[]], position: number);
    public constructor(type: TreeNodeType.BooleanNegation, children: [TreeNode], position: number);
    public constructor(type: TreeNodeType.Conditional, children: [TreeNode, TreeNode, TreeNode | null], position: number);
    public constructor(type: TreeNodeType.Atom, children: Token, position: number);
    public constructor(type: TreeNodeType, children: (TreeNode | string | null)[] | Token, position: number) {
        this.type = type;
        this.children = children;
        this.position = position;
    }

    /**
     * Returns a string representation of the node and its children, suitable for debugging.
     */
    public toDebugString(): string {
        return this.toDebugStringInner().join('\n');
    }

    private toDebugStringInner(): string[] {
        if (this.type === TreeNodeType.Atom) {
            const token = this.children as Token;
            return [ `Atom(${token.type} ${token.value})` ];
        }

        let lines = [ this.type.toString() ];
        for (const subnode of this.children as (TreeNode | string | null)[]) {
            let sublines: string[];
            if (subnode === null) {
                sublines = [ '  null' ];
            } else if (typeof subnode === 'string') {
                sublines = [ `  ${subnode}` ];
            } else {
                // Align sublines to the right
                sublines = subnode.toDebugStringInner().map(
                    (line: string) => '  ' + line
                );
            }

            lines = lines.concat(sublines);
        }

        return lines;
    }
}

/**
 * Supplementary type for better type checking in TreeNode constructor.
 * 
 * It's used to ensure that the children parameter of the TreeNode constructor is
 * only an array of some TreeNodes (any number of elements).
 */
type TypesWithManyNodeChildren =
    TreeNodeType.Semicolon |
    TreeNodeType.ArrayDefinition;

/**
 * Supplementary type for better type checking in TreeNode constructor.
 * 
 * It's used to ensure that the children parameter of the TreeNode constructor is
 * an array like [string, TreeNode]
 */
type TypesWithStringAndSingleNode =
    TreeNodeType.Assignment |
    TreeNodeType.ArrayAppend |
    TreeNodeType.ArithmeticUnary;

/**
 * Supplementary type for better type checking in TreeNode constructor.
 * 
 * It's used to ensure that the children parameter of the TreeNode constructor is
 * an array like [string, TreeNode, TreeNode]
 */
type TypesWithStringAndTwoNodes =
    TreeNodeType.IndexAssignment |
    TreeNodeType.Compare |
    TreeNodeType.KeywordOperator;

/**
 * Supplementary type for better type checking in TreeNode constructor.
 * 
 * It's used to ensure that the children parameter of the TreeNode constructor is
 * an array like [TreeNode, TreeNode]
 */
type TypesWithTwoNodes =
    TreeNodeType.Exponentiation |
    TreeNodeType.ArrayIndexing;

/**
 * Supplementary type for better type checking in TreeNode constructor.
 * 
 * It's used to ensure that the children parameter of the TreeNode constructor is
 * an array like [string, TreeNode, ...]
 */
type TypesWithStringAndManyNodes =
    TreeNodeType.Logic |
    TreeNodeType.ArithmeticAdditive |
    TreeNodeType.ArithmeticMultiplicative |
    TreeNodeType.FunctionCall;
