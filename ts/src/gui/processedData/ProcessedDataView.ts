import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { NodeValueView } from '../value/NodeValueView.js';

export class ProcessedDataView {
    protected element: HTMLElement;

    public constructor(node: ITreeNode) {
        this.element = document.createElement('span');
        this.element.textContent = ' -> ';

        if ('getValue' in node) {
            this.element.append(new NodeValueView(node as IEvaluableTreeNode).render());
        }
    }

    public render(): HTMLElement {
        return this.element;
    }
}