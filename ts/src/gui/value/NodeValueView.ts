import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { IValue } from '../../model/value/IValue.js';
import { IView } from '../IView.js';
import { ValueFormatter } from './ValueFormatter.js';

/**
 * A view for displaying the value of a node when it's ready.
 */
export class NodeValueView implements IView {
    protected element: HTMLElement;

    /**
     * @param node The node for which to display the value.
     * @param evaluationContext The context for which to fetch the value.
     */
    public constructor(node: IEvaluableTreeNode, evaluationContext: IEvaluationContext) {
        this.element = document.createElement('span');

        if (node.hasValue(evaluationContext)) {
            this.setValue(node.getValue(evaluationContext));
        } else {
            this.element.textContent = '...';
        }

        node.addOnValueSetCallback((node, context) => {
            // Ignore updates from other contexts
            if (context != evaluationContext) return;

            this.element.textContent = '';
            this.setValue(node.getValue(context));
        });
    }

    public render(): HTMLElement {
        return this.element;
    }

    protected setValue(value: IValue): void {
        this.element.textContent = '';
        this.element.appendChild(ValueFormatter.formatValue(value));
    }
}