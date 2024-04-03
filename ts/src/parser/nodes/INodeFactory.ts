import { ITreeNode } from '../../model/ITreeNode.js';
import { TreeNodeType } from '../../model/TreeNodeType.js';
import { Token } from '../Token.js';

/**
 * This interface is used by the parser to create new nodes in the parser tree.
 */
export interface INodeFactory {

    createNode(type: TreeNodeType, identity: Token, children: ITreeNode[]): ITreeNode;
}