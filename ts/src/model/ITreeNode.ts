import { TreeNodeType } from './TreeNodeType.js';

/**
 * Tree node is a building block of the parser tree. AbuseFilter rules are transformed into a tree
 * of nodes, where each node represents a single operation or value. All nodes higher in the tree
 * depend on the values of their children.
 */
export interface ITreeNode {

    /** Type of this node. */
    get type(): TreeNodeType;

    /** Child nodes of this node. */
    get children(): ITreeNode[];
}