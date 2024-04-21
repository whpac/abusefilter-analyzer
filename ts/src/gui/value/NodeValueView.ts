import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { ValueFormatter } from './ValueFormatter.js';

export class NodeValueView {
    protected element: HTMLElement;

    public constructor(node: IEvaluableTreeNode) {
        this.element = document.createElement('span');
        this.element.textContent = '...';

        node.addOnValueSetCallback((node, context) => {
            this.element.textContent = '';
            this.element.appendChild(ValueFormatter.formatValue(node.getValue(context)));
        });
    }

    public render(): HTMLElement {
        return this.element;
    }
}