import { Value } from '../../evaluator/value/Value.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { IValue } from '../../model/value/IValue.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
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
            // Ignore updates from unrelated contexts
            if (context.rootContext != evaluationContext.rootContext) return;

            this.element.textContent = '';
            this.setValue(node.getValue(context));
        });
    }

    public render(): HTMLElement {
        return this.element;
    }

    protected setValue(value: IValue): void {
        this.element.textContent = '';
        const formattedValue = ValueFormatter.formatValue(value);
        const shortenedValue = this.shortenValue(value, formattedValue);

        this.element.appendChild(shortenedValue ?? formattedValue);
        if (shortenedValue !== null) {
            const moreContainer = document.createElement('span');
            moreContainer.classList.add('afa-data-more');
            moreContainer.appendChild(formattedValue);
            this.element.appendChild(moreContainer);
        }
    }

    /**
     * Tries to render the value in a short form.
     * If there's no short form available, returns null.
     */
    protected shortenValue(value: IValue, originalRender: HTMLElement): HTMLElement | null {
        // Scalars usually don't need shortening
        switch (value.dataType) {
            case ValueDataType.Array:
                return this.shortenArray(value, originalRender);
            case ValueDataType.String:
                return this.shortenString(value, originalRender);
            default:
                return null;
        }
    }

    protected shortenArray(value: IValue, originalRender: HTMLElement): HTMLElement | null {
        // We allow output that's at most 15 characters long
        const maxLength = 15;
        if (originalRender.textContent!.length <= maxLength) return null;

        const arrayLength = value.toArray().length;
        const element = document.createElement('span');
        element.textContent = `array(${arrayLength})`;
        return element;
    }

    protected shortenString(value: IValue, originalRender: HTMLElement): HTMLElement | null {
        // We allow output that's at most 15 characters long
        const maxLength = 15;
        if (originalRender.textContent!.length <= maxLength) return null;

        const beginning = value.toString().substring(0, maxLength - 3);
        const beginningValue = new Value(ValueDataType.String, beginning);
        const element = document.createElement('span');
        element.appendChild(ValueFormatter.formatValue(beginningValue));
        element.append('...');
        return element;
    }
}