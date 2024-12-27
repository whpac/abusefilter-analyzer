import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { Token } from '../Token.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { INodeFactory } from '../../model/nodes/INodeFactory.js';
import { TreeNode } from './TreeNode.js';

/**
 * A simple tree node factory that produces `TreeNode` instances.
 */
export class TreeNodeFactory implements INodeFactory {

    public createNode(type: TreeNodeType, identity: Token, children: ITreeNode[]): TreeNode {
        return new TreeNode(type, identity, children);
    }
}