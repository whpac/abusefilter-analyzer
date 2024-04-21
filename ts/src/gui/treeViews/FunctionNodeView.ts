import { BlockNodeView } from './BlockNodeView.js';

export class FunctionNodeView extends BlockNodeView {
    protected canInline = true;

    protected renderAsInline(): HTMLElement {
        const element = document.createElement('span');
        element.classList.add('afa-function');

        element.appendChild(document.createTextNode(this.treeNode.identity.value));
        element.appendChild(document.createTextNode('('));
        element.appendChild(this.children[0].render());
        for (let i = 1; i < this.children.length; i++) {
            element.appendChild(document.createTextNode(', '));
            element.appendChild(this.children[i].render());
        }
        element.appendChild(document.createTextNode(')'));

        element.appendChild(this.dataView.render());
        return element;
    }

    public stopsInlining(): boolean {
        return true;
    }
}