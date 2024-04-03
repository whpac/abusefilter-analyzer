import { ITreeNode } from '../../model/ITreeNode.js';
import { Token } from '../Token.js';
import { TreeNodeType } from '../../model/TreeNodeType.js';
import { INodeFactory } from './INodeFactory.js';
import { TreeNode } from './TreeNode.js';

export class TreeNodeFactory implements INodeFactory {

    public createNode(type: TreeNodeType, identity: Token, children: ITreeNode[]): ITreeNode {
        return new TreeNode(type, identity, children);
    }
}