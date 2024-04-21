import { BlockNodeView } from './BlockNodeView.js';

export class ArrayDefinitionNodeView extends BlockNodeView {
    protected canInline = true;

    protected renderAsInline(): HTMLElement {
        const elements = this.children.map((child) => child.render());
        const element = document.createElement('span');
        element.classList.add('afa-array');
        element.appendChild(document.createTextNode('['));

        for (let i = 0; i < elements.length; i++) {
            if (i > 0) {
                element.appendChild(document.createTextNode(', '));
            }
            element.appendChild(elements[i]);
        }

        element.appendChild(document.createTextNode(']'));
        return element;
    }
}