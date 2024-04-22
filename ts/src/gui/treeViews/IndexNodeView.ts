import { BlockNodeView } from './BlockNodeView.js';

export class IndexNodeView extends BlockNodeView {
    protected canInline = true;

    protected renderAsInline(): HTMLElement {
        const element = document.createElement('span');
        element.appendChild(this.children[0].render());
        element.appendChild(this.createTokenNode('['));
        element.appendChild(this.children[1].render());
        element.appendChild(this.createTokenNode(']'));

        return element;
    }
}