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

    protected renderBlockHeader(): HTMLElement {
        const element = document.createElement('span');
        element.textContent = 'Get element at index';
        return element;
    }

    protected getBlockHints(): string[] {
        return ['array', 'index'];
    }
}