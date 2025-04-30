import { ValueComparer } from '../../evaluator/value/ValueComparer.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { IValue } from '../../model/value/IValue.js';
import { IView } from '../IView.js';
import { NodeValueViewBase } from './NodeValueViewBase.js';
import { ValueFormatter } from './ValueFormatter.js';
import { ValueFrequencyPopup, ValueFrequencies } from './ValueFrequencyPopup.js';

/**
 * A view for displaying the most frequent values of a node at multiple evaluations.
 */
export class NodeValueFrequencyView extends NodeValueViewBase implements IView {
    protected element: HTMLButtonElement;
    // This is not optimal for large data sets, but it's good enough for now
    protected values: ValueFrequencies = [];
    protected totalValueCount = 0;

    /**
     * @param node The node for which to display the value.
     * @param evaluationContext The context for which to fetch the value.
     */
    public constructor(node: IEvaluableTreeNode) {
        super();

        this.element = document.createElement('button');
        this.element.classList.add('afa-silent-button');
        this.element.type = 'button';
        this.element.textContent = '...';

        this.listenToChanges(node);

        // For the initial render, display the value immediately as we are sure that there's
        // only a single initial rendering.
        this.updateViewImmediate();

        this.element.addEventListener('click', (e) => {
            const popup = new ValueFrequencyPopup();
            popup.display(this.values, this.element);

            // So as not to trigger expand/collapse on the parent <details>
            e.stopPropagation();
            e.preventDefault();
        });
    }

    protected override onValueSet(value: IValue): void {
        this.totalValueCount++;

        let found = false;
        for (const entry of this.values) {
            if (ValueComparer.areEqual(entry.value, value, true)) {
                entry.count++;
                found = true;
                break;
            }
        }

        if (!found) {
            this.values.push({ value, count: 1 });
        }

        this.scheduleViewUpdate();
    }

    protected override onErrorSet(errors: Error[], context: IEvaluationContext): void {
        // TODO: Add errors here
        return;
        const shortText = document.createElement('span');
        shortText.classList.add('afa-data-error');
        shortText.textContent = 'Errors: ' + errors.length;

        if (context.isSpeculative) {
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

        const maxLength = 15;
        const formattedValue = ValueFormatter.formatValue(mostFrequent.value);
        
        if (formattedValue.textContent!.length <= maxLength) {
            this.setViewContent(formattedValue, frequency);
        } else {
            const shortenedValue = this.shortenValue(mostFrequent.value, maxLength);
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
}
