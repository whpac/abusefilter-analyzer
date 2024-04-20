import { BlockNodeView } from './BlockNodeView.js';
import { ProcessedNodeDataView } from './ProcessedNodeDataView.js';

export class OperatorNodeView extends BlockNodeView {
    protected canInline = true;

    public render(): HTMLElement {
        if (!this.isInline()) return super.render();

        if (this.element === null) {
            this.element = document.createElement('span');
            this.element.classList.add('afa-operator');

            if (this.arity === 1) {
                this.element.appendChild(document.createTextNode(this.treeNode.identity.value));
                this.element.appendChild(this.children[0].render());
            } else {
                this.element.appendChild(this.children[0].render());
                for (let i = 1; i < this.children.length; i++) {
                    this.element.appendChild(document.createTextNode(' ' + this.treeNode.identity.value + ' '));
                    this.element.appendChild(this.children[i].render());
                }

                // We do it only for non-unary operators because those are trivial to understand
                const processedDataView = new ProcessedNodeDataView();
                this.element.appendChild(processedDataView.getElement());
            }
        }
        return this.element;
    }

    public stopsInlining(): boolean {
        return this.arity > 1;
    }

    public get arity(): number {
        return this.children.length;
    }
}