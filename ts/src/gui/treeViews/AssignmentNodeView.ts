import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { BlockNodeView } from './BlockNodeView.js';

export class AssignmentNodeView extends BlockNodeView {
    protected canInline = true;

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
            element.appendChild(this.children[2].render());
            element.appendChild(this.createTokenNode(']'));
        }

        element.appendChild(this.createTokenNode(' := ', ['afa-operator']));
        element.appendChild(this.children[1].render());
        return element;
    }

    protected renderAsBlock(): HTMLElement {
        const header = this.renderBlockHeader();

        if (this.children.length > 0) {
            const childrenListElement = document.createElement('ul');
            header.appendChild(childrenListElement);

            // We're storing index assignment in a non-natural order
            let childrenOrder = [0, 1];
            if (this.treeNode.type === TreeNodeType.IndexAssignment) {
                childrenOrder = [0, 2, 1];
            }

            const hints = this.getBlockHints();
            for (const childIndex of childrenOrder) {
                const childElement = document.createElement('li');
                if (hints[childIndex]) {
                    const hintView = this.renderHintView(hints[childIndex]);
                    childElement.appendChild(hintView);
                }
                const childView = this.children[childIndex];
                childElement.appendChild(childView.render());
                childrenListElement.appendChild(childElement);
            }
        }

        return header;
    }

    protected getBlockHints(): string[] {
        switch (this.treeNode.type) {
            case TreeNodeType.Assignment:
                return ['variable', 'value'];
            case TreeNodeType.IndexAssignment:
                return ['array', 'value', 'index'];
            default:
                return [];
        }
    }
}