import { BlockNodeView } from './BlockNodeView.js';

export class OperatorNodeView extends BlockNodeView {
    protected canInline = true;

    protected renderAsInline(): HTMLElement {
        const element = document.createElement('span');
        element.classList.add('afa-operator');

        if (this.arity === 1) {
            element.appendChild(document.createTextNode(this.treeNode.identity.value));
            element.appendChild(this.children[0].render());
        } else {
            element.appendChild(this.children[0].render());
            for (let i = 1; i < this.children.length; i++) {
                element.appendChild(document.createTextNode(' ' + this.treeNode.identity.value + ' '));
                element.appendChild(this.children[i].render());
            }

            // We do it only for non-unary operators because those are trivial to understand
            const processedDataView = this.createProcessedDataView();
            element.appendChild(processedDataView.render());
        }
        return element;
    }

    public stopsInlining(): boolean {
        return this.arity > 1;
    }

    public get arity(): number {
        return this.children.length;
    }
}