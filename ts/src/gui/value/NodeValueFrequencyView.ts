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
    // This is the total number of values and error sets that have been reported by the relevant node
    protected totalEvaluationsCount = 0;
    protected errors: Error[] = [];

    /**
     * @param node The node for which to display the value.
     * @param evaluationContext The context for which to fetch the value.
     */
    public constructor(node: IEvaluableTreeNode) {
        super();

        this.element = document.createElement('button');
        this.element.classList.add('afa-silent-button');
        this.element.type = 'button';
        this.element.title = 'Click to see the value frequency';
        this.element.textContent = '...';

        this.listenToChanges(node);

        // For the initial render, display the value immediately as we are sure that there's
        // only a single initial rendering.
        this.updateViewImmediate();

        this.element.addEventListener('click', (e) => {
            const popup = new ValueFrequencyPopup();
            popup.display(this.values, this.errors, this.element);

            // So as not to trigger expand/collapse on the parent <details>
            e.stopPropagation();
            e.preventDefault();
        });
    }

    protected override onValueSet(value: IValue): void {
        this.totalEvaluationsCount++;

        let found = false;
        for (const entry of this.values) {
            // undefined needs to be handled separately, as by definition they are never equal
            // and here we want to treat them as equal
            if (ValueComparer.areEqual(entry.value, value, true) || (entry.value.isUndefined && value.isUndefined)) {
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
        if (context.isSpeculative) {
            // We only display 'real' errors, not speculative ones
            return;
        }

        this.totalEvaluationsCount++;

        this.errors.unshift(...errors);
        this.scheduleViewUpdate();
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
        const frequency = mostFrequent.count / this.totalEvaluationsCount;

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

    protected setViewContent(value: HTMLElement, frequency: number | null): void {
        this.element.textContent = '';

        this.element.appendChild(value);

        if (frequency !== null) {
            // Floor so that we don't display 100% for e.g. 99.5%
            frequency = Math.floor(frequency * 100);
            this.element.append(` (${frequency}%)`);
        }

        if (this.errors.length > 0) {
            this.element.append(`, ${this.errors.length} errors`);
        }
    }
}
