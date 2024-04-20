import { BlockNodeView } from './BlockNodeView.js';

export class ArrayDefinitionNodeView extends BlockNodeView {
    protected canInline = true;

    public render(): HTMLElement {
        if (!this.isInline()) return super.render();

        if (this.element === null) {
            const elements = this.children.map((child) => child.render());
            this.element = document.createElement('span');
            this.element.classList.add('afa-array');
            this.element.appendChild(document.createTextNode('['));

            for (let i = 0; i < elements.length; i++) {
                if (i > 0) {
                    this.element.appendChild(document.createTextNode(', '));
                }
                this.element.appendChild(elements[i]);
            }

            this.element.appendChild(document.createTextNode(']'));
        }
        return this.element;
    }
}