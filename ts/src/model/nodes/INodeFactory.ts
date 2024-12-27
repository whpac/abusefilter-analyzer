import { IToken } from '../tokens/IToken.js';
import { ITreeNode } from './ITreeNode.js';
import { TreeNodeType } from './TreeNodeType.js';

/**
 * This interface represents an object that abstracts the creation of
 * syntax tree nodes. It can be used to generically create node, no matter
 * of its exact type.
 * @param TNode Type of the nodes that will be created
 */
export interface INodeFactory<TNode extends ITreeNode = ITreeNode> {

    /**
     * Creates a new node
     * @param type Type of the newly-created node
     * @param identity The token associated with the node
     * @param children Children of the newly-created node
     */
    createNode(type: TreeNodeType, identity: IToken, children: TNode[]): TNode;
}