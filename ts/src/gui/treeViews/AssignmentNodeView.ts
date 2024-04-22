import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { IView } from '../IView.js';
import { BlockNodeView } from './BlockNodeView.js';
import { INodeView } from './INodeView.js';

export class AssignmentNodeView extends BlockNodeView {
    protected canInline = true;

    public constructor(node: ITreeNode, childViews: INodeView[], dataView: IView) {
        // For index assignment, change the order to make it more natural
        if (node.type === TreeNodeType.IndexAssignment && childViews.length === 3) {
            childViews = [childViews[0], childViews[2], childViews[1]];
        }
        super(node, childViews, dataView);
    }

    protected renderAsInline(): HTMLElement {
        const isIndexAssignment = this.treeNode.type === TreeNodeType.IndexAssignment;
        const isArrayAppend = isIndexAssignment && this.children.length === 2;
        const isArrayAssign = isIndexAssignment && this.children.length === 3;

        const element = document.createElement('span');
        element.appendChild(this.children[0].render());

        if (isArrayAppend) {
            element.appendChild(this.createTokenNode('[]'));
        } else if (isArrayAssign) {
            element.appendChild(this.createTokenNode('['));
            element.appendChild(this.children[1].render());
            element.appendChild(this.createTokenNode(']'));
        }

        element.appendChild(this.createTokenNode(' := ', ['afa-operator']));
        element.appendChild(this.children[!isArrayAssign ? 1 : 2].render());
        return element;
    }

    protected renderBlockHeader(): HTMLElement {
        const element = document.createElement('span');
        const isArrayAssign = this.treeNode.type === TreeNodeType.IndexAssignment;
        if (isArrayAssign) {
            if (this.children.length === 3) {
                element.append('Assignment to array index');
            } else {
                element.append('Append to array');
            }
        } else {
            element.append('Assignment');
        }
        return element;
    }

    protected getBlockHints(): string[] {
        switch (this.treeNode.type) {
            case TreeNodeType.Assignment:
                return ['variable', 'value'];
            case TreeNodeType.IndexAssignment:
                return this.children.length === 3 ?
                    ['array', 'index', 'value'] : ['array', 'value'];
            default:
                return [];
        }
    }
}