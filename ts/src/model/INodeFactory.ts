import { IToken } from './IToken.js';
import { ITreeNode } from './ITreeNode.js';
import { TreeNodeType } from './TreeNodeType.js';

/**
 * This interface is used by the parser to create new nodes in the parser tree.
 */
export interface INodeFactory {

    createNode(type: TreeNodeType, identity: IToken, children: ITreeNode[]): ITreeNode;
}