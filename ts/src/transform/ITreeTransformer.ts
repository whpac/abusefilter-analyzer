import { INodeFactory } from '../model/nodes/INodeFactory.js';
import { ITreeNode } from '../model/nodes/ITreeNode.js';

export interface ITreeTransformer {

    transform<TNode extends ITreeNode>(node: ITreeNode, nodeFactory: INodeFactory<TNode>): TNode;
}