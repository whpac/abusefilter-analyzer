import { Value } from '../../evaluator/value/Value.js';
import { ValueComparer } from '../../evaluator/value/ValueComparer.js';
import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { IValue } from '../../model/value/IValue.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { IView } from '../IView.js';
import { ValueFormatter } from './ValueFormatter.js';
import { ValueFrequencyPopup, ValueFrequencies } from './ValueFrequencyPopup.js';

/**
 * A view for displaying the most frequent values of a node at multiple evaluations.
 * TODO: Refactor and prepare a common base class for this and NodeValueView.
 */
export class ValueFrequencyPillView implements IView {
    protected element: HTMLButtonElement;
    // This is not optimal for large data sets, but it's good enough for now
    protected values: ValueFrequencies = [];
    protected totalValueCount = 0;

    /**
     * @param node The node for which to display the value.
     * @param evaluationContext The context for which to fetch the value.
     */
    public constructor(node: IEvaluableTreeNode) {
        this.element = document.createElement('button');
        this.element.classList.add('afa-silent-button');
        this.element.type = 'button';
        this.element.textContent = '...';

        for (const context of node.getContextsWithValue()) {
            this.addValue(node.getValue(context));
        }
        for (const context of node.getContextsWithErrors()) {
            this.addErrors(node.getErrors(context), context.isSpeculative);
        }
        // For the initial render, display the value immediately as we are sure that there's
        // only a single initial rendering.
        this.updateViewImmediate();

        node.addOnValueSetCallback((node, context) => {
            this.addValue(node.getValue(context));
            this.scheduleViewUpdate();
        });
        node.addOnErrorCallback((node, context) => {
            this.addErrors(node.getErrors(context), context.isSpeculative);
            this.scheduleViewUpdate();
        });

        this.element.addEventListener('click', (e) => {
            const popup = new ValueFrequencyPopup();
            popup.display(this.values, this.element);

            // So as not to trigger expand/collapse on the parent <details>
            e.stopPropagation();
            e.preventDefault();
        });
    }

    public render(): HTMLElement {
        return this.element;
    }

    protected addValue(value: IValue): void {
        this.totalValueCount++;
        for (const entry of this.values) {
            if (ValueComparer.areEqual(entry.value, value, true)) {
                entry.count++;
                return;
            }
        }

        this.values.push({ value, count: 1 });
    }

    protected addErrors(errors: Error[], isSpeculative: boolean): void {
        // TODO: Add errors here
        return;
        const shortText = document.createElement('span');
        shortText.classList.add('afa-data-error');
        shortText.textContent = 'Errors: ' + errors.length;

        if (isSpeculative) {
            shortText.classList.add('afa-data-error-speculative');
            shortText.textContent += ' (speculative)';
        }

        this.setViewContent(shortText, null);
    }

    private updateTimeoutReference: number | null = null;
    /**
     * Schedule an update of the view. Updates will be performed at most once every 50ms.
     */
    protected scheduleViewUpdate(): void {
        if (this.updateTimeoutReference !== null) {
            return;
        }

        this.updateTimeoutReference = window.setTimeout(() => {
            this.updateTimeoutReference = null;
            this.updateViewImmediate();
        }, 50);
    }

    /**
     * Updates the view to show the most frequent value.
     * The update is done immediately. For performance reasons, such updates should
     * be usually deferred by a few milliseconds, so that multiple new values can be added
     * at the same time.
     */
    private updateViewImmediate(): void {
        if (this.values.length === 0) {
            this.element.textContent = '...';
            return;
        }

        this.values.sort((a, b) => b.count - a.count);

        const mostFrequent = this.values[0];
        const frequency = mostFrequent.count / this.totalValueCount;

        if (frequency < 0.3) {
            const message = document.createElement('span');
            message.textContent = 'multiple values';
            this.setViewContent(message, null);
            return;
        }

        const formattedValue = ValueFormatter.formatValue(mostFrequent.value);
        const shortenedValue = this.shortenValue(mostFrequent.value, formattedValue);


        if (shortenedValue === null) {
            this.setViewContent(formattedValue, frequency);
        } else {
            this.setViewContent(shortenedValue, frequency);
        }
    }

    protected setViewContent(shortValue: HTMLElement, frequency: number | null): void {
        this.element.textContent = '';

        this.element.appendChild(shortValue);

        if (frequency !== null) {
            // Floor so that we don't display 100% for e.g. 99.5%
            frequency = Math.floor(frequency * 100);
            this.element.append(` (${frequency}%)`);
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
