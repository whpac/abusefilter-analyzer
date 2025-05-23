import { INodeFactory } from '../model/nodes/INodeFactory.js';
import { ITreeNode } from '../model/nodes/ITreeNode.js';
import { TreeNodeType } from '../model/nodes/TreeNodeType.js';
import { ITreeTransformer } from './ITreeTransformer.js';

/**
 * Transforms a tree by flattening associative operators.
 */
export class FlattenAssociativeOpsTransformer implements ITreeTransformer {

    public transform<TNode extends ITreeNode>(node: ITreeNode, nodeFactory: INodeFactory<TNode>): TNode {
        let children = node.children;

        const isOperator = node.type === TreeNodeType.Operator;
        const isAssociative = ['&', '|', '^', '+', '*'].includes(node.identity.value);

        if (isOperator && isAssociative) {
            children = this.flatten(node);
        }
        const newChildren = children.map(child => this.transform(child, nodeFactory));
        return nodeFactory.createNode(node.type, node.identity, newChildren);
    }

    /**
     * Returns an array of children that the root node can have in order to achieve a more shallow tree
     * @param node Root node of the tree to flatten
     */
    public flatten(node: ITreeNode): ITreeNode[] {
        const flattened = [];
        for (const child of node.children) {
            if (child.type === TreeNodeType.Operator && child.identity.value === node.identity.value) {
                flattened.push(...this.flatten(child));
            }
            else {
                flattened.push(child);
            }
        }
        return flattened;
    }
}