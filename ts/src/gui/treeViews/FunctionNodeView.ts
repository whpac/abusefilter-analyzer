import { BlockNodeView } from './BlockNodeView.js';

export class FunctionNodeView extends BlockNodeView {
    protected canInline = true;

    protected renderAsInline(): HTMLElement {
        const element = document.createElement('span');

        element.appendChild(this.createTokenNode(this.treeNode.identity.value, ['afa-function']));

        element.appendChild(this.createTokenNode('('));
        element.appendChild(this.children[0].render());
        for (let i = 1; i < this.children.length; i++) {
            element.appendChild(this.createTokenNode(', '));
            element.appendChild(this.children[i].render());
        }
        element.appendChild(this.createTokenNode(')'));

        element.append(' ');
        element.appendChild(this.dataView.render());
        return element;
    }

    public stopsInlining(): boolean {
        return true;
    }

    protected renderBlockHeader(): HTMLElement {
        const element = document.createElement('span');
        element.append('Call function ');
        element.append(this.createTokenNode(this.treeNode.identity.value, ['afa-function']));
        return element;
    }

    protected getBlockHints(): string[] {
        // TODO: Return argument labels
        return ['argument'];
    }
}