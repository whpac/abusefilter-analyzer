import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { BlockNodeView } from './BlockNodeView.js';

export class AssignmentNodeView extends BlockNodeView {
    protected canInline = true;

    protected renderAsInline(): HTMLElement {
        const isIndexAssignment = this.treeNode.type === TreeNodeType.IndexAssignment;

        const element = document.createElement('span');
        element.classList.add('afa-assignment');
        element.appendChild(this.children[0].render());

        if (isIndexAssignment) {
            element.appendChild(document.createTextNode('['));
            if (this.children.length > 2)
                element.appendChild(this.children[2].render());
            element.appendChild(document.createTextNode(']'));
        }

        element.appendChild(document.createTextNode(' := '));
        element.appendChild(this.children[1].render());
        return element;
    }
}