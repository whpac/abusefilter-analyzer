import { INodeFactory } from '../model/nodes/INodeFactory.js';
import { ITreeNode } from '../model/nodes/ITreeNode.js';

/**
 * All tree transformers are expected to implement this interface.
 */
export interface ITreeTransformer {

    /**
     * Performs a transformation of the given tree.
     * @param node The root node of the tree to transform.
     * @param nodeFactory A factory to create new nodes.
     */
    transform<TNode extends ITreeNode>(node: ITreeNode, nodeFactory: INodeFactory<TNode>): TNode;
}