import { BlockNodeView } from './BlockNodeView.js';

export class IndexNodeView extends BlockNodeView {
    protected canInline = true;

    public render(): HTMLElement {
        if (!this.isInline()) return super.render();

        if (this.element === null) {
            this.element = document.createElement('span');
            this.element.classList.add('afa-indexing');
            this.element.appendChild(this.children[0].render());
            this.element.appendChild(document.createTextNode('['));
            this.element.appendChild(this.children[1].render());
            this.element.appendChild(document.createTextNode(']'));
        }
        return this.element;
    }
}