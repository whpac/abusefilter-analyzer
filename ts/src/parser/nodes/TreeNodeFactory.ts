import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { Token } from '../Token.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { INodeFactory } from '../../model/nodes/INodeFactory.js';
import { TreeNode } from './TreeNode.js';

export class TreeNodeFactory implements INodeFactory {

    public createNode(type: TreeNodeType, identity: Token, children: ITreeNode[]): ITreeNode {
        return new TreeNode(type, identity, children);
    }
}