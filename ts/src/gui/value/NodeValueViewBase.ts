import { Value } from '../../evaluator/value/Value.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { IValue } from '../../model/value/IValue.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { IView } from '../IView.js';
import { ValueFormatter } from './ValueFormatter.js';

export abstract class NodeValueViewBase implements IView {
    protected element: HTMLElement;

    protected constructor() {
        this.element = document.createElement('span');
    }

    public render(): HTMLElement {
        return this.element;
    }

    protected listenToChanges(node: IEvaluableTreeNode): void {
        for (const context of node.getContextsWithErrors()) {
            this.onErrorSet(node.getErrors(context), context);
        }
        node.addOnErrorCallback((node, context) => {
            this.onErrorSet(node.getErrors(context), context);
        });

        for (const context of node.getContextsWithValue()) {
            this.onValueSet(node.getValue(context), context);
        }
        node.addOnValueSetCallback((node, context) => {
            this.onValueSet(node.getValue(context), context);
        });
    }

    protected abstract onValueSet(value: IValue, context: IEvaluationContext): void;
    protected abstract onErrorSet(errors: Error[], context: IEvaluationContext): void;

    /**
     * Tries to render the value in a short form.
     * If there's no short form available, returns null.
     */
    protected shortenValue(value: IValue, originalRender: HTMLElement): HTMLElement | null {
        // Scalars usually don't need shortening
        switch (value.dataType) {
            case ValueDataType.Array:
                return this.shortenArray(value as IValue<unknown[]>, originalRender);
            case ValueDataType.String:
                return this.shortenString(value as IValue<string>, originalRender);
            default:
                return null;
        }
    }

    protected shortenArray(value: IValue<unknown[]>, originalRender: HTMLElement): HTMLElement | null {
        // We allow output that's at most 15 characters long
        const maxLength = 15;
        if (originalRender.textContent!.length <= maxLength) return null;

        const arrayLength = value.value.length;
        const element = document.createElement('span');
        element.textContent = `array(${arrayLength})`;
        return element;
    }

    protected shortenString(value: IValue<string>, originalRender: HTMLElement): HTMLElement | null {
        // We allow output that's at most 15 characters long
        const maxLength = 15;
        if (originalRender.textContent!.length <= maxLength) return null;

        const beginning = value.value.substring(0, maxLength - 3);
        const beginningValue = new Value(ValueDataType.String, beginning);
        const element = document.createElement('span');
        element.appendChild(ValueFormatter.formatValue(beginningValue));
        element.append('...');
        return element;
    }
}