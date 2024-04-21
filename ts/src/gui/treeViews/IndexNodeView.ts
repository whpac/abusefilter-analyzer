import { BlockNodeView } from './BlockNodeView.js';

export class IndexNodeView extends BlockNodeView {
    protected canInline = true;

    protected renderAsInline(): HTMLElement {
        const element = document.createElement('span');
        element.classList.add('afa-indexing');
        element.appendChild(this.children[0].render());
        element.appendChild(document.createTextNode('['));
        element.appendChild(this.children[1].render());
        element.appendChild(document.createTextNode(']'));

        return element;
    }
}