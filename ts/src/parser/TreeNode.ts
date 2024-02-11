import { TreeNodeType } from './TreeNodeType.js';

/**
 * Represents a single node in the parser tree. It chan contain other nodes or simple values.
 * 
 * Based on https://phabricator.wikimedia.org/diffusion/EABF/browse/master/includes/Parser/AFPTreeNode.php
 */
export abstract class TreeNode {

    /** Type of this node */
    public readonly type: TreeNodeType;

    /**
     * The position of the node in the source code, used for error reporting.
     */
    public readonly position: number;


    public constructor(type: TreeNodeType, position: number) {
        this.type = type;
        this.position = position;
    }

    /**
     * Returns a string representation of the node and its children, suitable for debugging.
     */
    public toDebugString(): string {
        return this.toDebugStringInner().join('\n');
    }

    /**
     * An internal method for generating debug strings. It's called recursively by toDebugString.
     */
    public abstract toDebugStringInner(): string[];
}
