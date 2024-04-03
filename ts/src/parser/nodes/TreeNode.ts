import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { Token } from '../Token.js';

/**
 * Represents a single node in the parser tree. It chan contain other nodes or simple values.
 * 
 * Based on https://phabricator.wikimedia.org/diffusion/EABF/browse/master/includes/Parser/AFPTreeNode.php
 */
export class TreeNode implements ITreeNode {

    public readonly type: TreeNodeType;

    public readonly identity: Token;

    public readonly children: readonly ITreeNode[];


    public constructor(type: TreeNodeType, identity: Token, children: ITreeNode[] = []) {
        this.type = type;
        this.identity = identity;
        this.children = children;
    }
}
