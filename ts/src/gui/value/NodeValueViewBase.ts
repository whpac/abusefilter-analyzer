import { Value } from '../../evaluator/value/Value.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { IValue } from '../../model/value/IValue.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { IView } from '../IView.js';
import { ValueFormatter } from './ValueFormatter.js';

export abstract class NodeValueViewBase implements IView {
    protected abstract get element(): HTMLElement;

    public render(): HTMLElement {
        return this.element;
    }

    /**
     * Starts listening to value changes and errors on the given node.
     * This method calls the appropriate handlers also with the values
     * and errors that are initially present in the node.
     * @param node The node to listen to for changes.
     */
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

    /**
     * Handles a value of the node that has been set.
     * @param value The value that has been set.
     * @param context The execution context in which the value was set.
     */
    protected abstract onValueSet(value: IValue, context: IEvaluationContext): void;

    /**
     * Handles the errors of the node that have been set.
     * @param errors The errors that have been set.
     * @param context The execution context in which the errors were set.
     */
    protected abstract onErrorSet(errors: Error[], context: IEvaluationContext): void;

    /**
     * Renders the value in a shortened form.
     * @param value The value to render.
     * @param maxLength The maximum length of the value to display.
     * @returns The shortened value as an HTML element.
     */
    protected shortenValue(value: IValue, maxLength: number): HTMLElement {
        // Scalars usually don't need shortening
        switch (value.dataType) {
            case ValueDataType.Array:
                return this.shortenArray(value as IValue<unknown[]>);
            case ValueDataType.String:
                return this.shortenString(value as IValue<string>, maxLength);
            default:
                return ValueFormatter.formatValue(value);
        }
    }

    private shortenArray(value: IValue<unknown[]>): HTMLElement {
        const arrayLength = value.value.length;
        const element = document.createElement('span');
        element.textContent = `array(${arrayLength})`;
        return element;
    }

    private shortenString(value: IValue<string>, maxLength: number): HTMLElement {
        const beginning = value.value.substring(0, maxLength - 3);
        const beginningValue = new Value(ValueDataType.String, beginning);
        const element = document.createElement('span');
        element.appendChild(ValueFormatter.formatValue(beginningValue));
        element.append('...');
        return element;
    }
}