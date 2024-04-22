import { BlockNodeView } from './BlockNodeView.js';

export class ArrayDefinitionNodeView extends BlockNodeView {
    protected canInline = true;

    protected renderAsInline(): HTMLElement {
        const elements = this.children.map((child) => child.render());
        const element = document.createElement('span');
        element.appendChild(this.createTokenNode('['));

        for (let i = 0; i < elements.length; i++) {
            if (i > 0) {
                element.appendChild(this.createTokenNode(', '));
            }
            element.appendChild(elements[i]);
        }

        element.appendChild(this.createTokenNode(']'));
        return element;
    }

    protected renderBlockHeader(): HTMLElement {
        const element = document.createElement('span');
        element.textContent = 'Array definition';
        return element;
    }

    protected getBlockHints(): (index: number) => string {
        return (index: number) => index.toString();
    }

    public isInline(): boolean {
        if (!super.isInline()) return false;
        if (this.children.length > 8) return false;

        let totalLength = 0;
        for (const child of this.children) {
            totalLength += child.render().textContent!.length;
        }
        return totalLength < 100;
    }
}