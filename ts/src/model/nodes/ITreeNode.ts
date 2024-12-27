import { IToken } from '../tokens/IToken.js';
import { TreeNodeType } from './TreeNodeType.js';

/**
 * Tree node is a building block of the parser tree. AbuseFilter rules are transformed into a tree
 * of nodes, where each node represents a single operation or value. All nodes higher in the tree
 * depend on the values of their children.
 */
export interface ITreeNode {

    /**
     * General type of this node. Must be one of the predefined types. This field is used by other
     * modules to determine how to process the node and what is the meaning of its children.
     */
    get type(): TreeNodeType;

    /**
     * The token that introduced this node. Further narrows the type of this node.
     * Can be used together with the `type` field to determine the exact meaning of this node.
     */
    get identity(): IToken;

    /**
     * Subnodes of this node. They represent the arguments for the operation designated by this node.
     * All nodes, except for atoms, are expected to have at least one child.
     */
    get children(): readonly ITreeNode[];
}