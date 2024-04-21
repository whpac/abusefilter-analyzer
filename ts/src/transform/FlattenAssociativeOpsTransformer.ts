import { INodeFactory } from '../model/nodes/INodeFactory.js';
import { ITreeNode } from '../model/nodes/ITreeNode.js';
import { TreeNodeType } from '../model/nodes/TreeNodeType.js';
import { ITreeTransformer } from './ITreeTransformer.js';

export class FlattenAssociativeOpsTransformer implements ITreeTransformer {
    private static readonly associativeOperators = ['&', '|', '^', '+', '*'];

    public transform<TNode extends ITreeNode>(node: ITreeNode, nodeFactory: INodeFactory<TNode>): TNode {
        if (node.type === TreeNodeType.Operator
            && FlattenAssociativeOpsTransformer.associativeOperators.includes(node.identity.value)
        ) {
            const flattenedChildren = this.flatten(node);
            const newChildren = flattenedChildren.map(child => this.transform(child, nodeFactory));
            return nodeFactory.createNode(node.type, node.identity, newChildren);
        }
        const newChildren = node.children.map(child => this.transform(child, nodeFactory));
        return nodeFactory.createNode(node.type, node.identity, newChildren);
    }

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