import { BlockNodeView } from './BlockNodeView.js';
import { ProcessedNodeDataView } from './ProcessedNodeDataView.js';

export class FunctionNodeView extends BlockNodeView {
    protected canInline = true;

    public render(): HTMLElement {
        if (!this.isInline()) return super.render();

        if (this.element === null) {
            this.element = document.createElement('span');
            this.element.classList.add('afa-function');

            this.element.appendChild(document.createTextNode(this.treeNode.identity.value));
            this.element.appendChild(document.createTextNode('('));
            this.element.appendChild(this.children[0].render());
            for (let i = 1; i < this.children.length; i++) {
                this.element.appendChild(document.createTextNode(', '));
                this.element.appendChild(this.children[i].render());
            }
            this.element.appendChild(document.createTextNode(')'));

            const processedDataView = new ProcessedNodeDataView();
            this.element.appendChild(processedDataView.getElement());
        }
        return this.element;
    }

    public stopsInlining(): boolean {
        return true;
    }
}