import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { ArrayDefinitionNodeView } from './ArrayDefinitionNodeView.js';
import { AssignmentNodeView } from './AssignmentNodeView.js';
import { AtomNodeView } from './AtomNodeView.js';
import { BlockNodeView } from './BlockNodeView.js';
import { FunctionNodeView } from './FunctionNodeView.js';
import { INodeView } from './INodeView.js';
import { IndexNodeView } from './IndexNodeView.js';
import { OperatorNodeView } from './OperatorNodeView.js';

export class ViewFactory {

    public createView(node: ITreeNode): INodeView {
        const childViews: INodeView[] = [];
        for (const child of node.children) {
            childViews.push(this.createView(child));
        }
        return this.createViewWithChildren(node, childViews);
    }

    public createViewWithChildren(node: ITreeNode, childViews: INodeView[]): INodeView {
        switch (node.type) {
            case TreeNodeType.Atom:
                return new AtomNodeView(node);
            case TreeNodeType.ArrayDefinition:
                return new ArrayDefinitionNodeView(node, childViews);
            case TreeNodeType.Assignment:
            case TreeNodeType.IndexAssignment:
                return new AssignmentNodeView(node, childViews);
            case TreeNodeType.ArrayIndexing:
                return new IndexNodeView(node, childViews);
            case TreeNodeType.Operator:
                return new OperatorNodeView(node, childViews);
            case TreeNodeType.FunctionCall:
                return new FunctionNodeView(node, childViews);
            default:
                return new BlockNodeView(node, childViews);
        }
    }
}