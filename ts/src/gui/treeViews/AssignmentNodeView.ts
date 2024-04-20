import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { BlockNodeView } from './BlockNodeView.js';

export class AssignmentNodeView extends BlockNodeView {
    protected canInline = true;

    public render(): HTMLElement {
        if (!this.isInline()) return super.render();

        if (this.element === null) {
            const isIndexAssignment = this.treeNode.type === TreeNodeType.IndexAssignment;

            this.element = document.createElement('span');
            this.element.classList.add('afa-assignment');
            this.element.appendChild(this.children[0].render());

            if (isIndexAssignment) {
                this.element.appendChild(document.createTextNode('['));
                if (this.children.length > 2)
                    this.element.appendChild(this.children[2].render());
                this.element.appendChild(document.createTextNode(']'));
            }

            this.element.appendChild(document.createTextNode(' := '));
            this.element.appendChild(this.children[1].render());
        }
        return this.element;
    }
}