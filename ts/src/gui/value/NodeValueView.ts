import { i18n } from '../../i18n/i18n.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { IValue } from '../../model/value/IValue.js';
import { IView } from '../IView.js';
import { NodeValueViewBase } from './NodeValueViewBase.js';
import { ValueFormatter } from './ValueFormatter.js';

/**
 * A view for displaying the value of a node when it's ready.
 */
export class NodeValueView extends NodeValueViewBase implements IView {
    protected element: HTMLSpanElement;
    protected relevantContext: IEvaluationContext;

    /**
     * @param node The node for which to display the value.
     * @param evaluationContext The context for which to fetch the value.
     */
    public constructor(node: IEvaluableTreeNode, evaluationContext: IEvaluationContext) {
        super();

        this.element = document.createElement('span');
        this.element.textContent = '...';
        this.relevantContext = evaluationContext;

        this.listenToChanges(node);
    }

    protected override onValueSet(value: IValue, context: IEvaluationContext): void {
        if (!context.isEquivalentTo(this.relevantContext)) return;

        this.element.textContent = '';
        const maxLength = 15;
        const formattedValue = ValueFormatter.formatValue(value);
        
        if (formattedValue.textContent!.length <= maxLength) {
            this.setViewContent(formattedValue, null);
        } else {
            const shortenedValue = this.shortenValue(value, maxLength);
            this.setViewContent(shortenedValue, formattedValue);
        }
    }

    protected override onErrorSet(errors: Error[], context: IEvaluationContext): void {
        if (!context.isEquivalentTo(this.relevantContext)) return;

        const shortText = document.createElement('span');
        shortText.classList.add('afa-data-error');
        shortText.textContent = i18n('afa-gui-value-error', errors.length);

        if (context.isSpeculative) {
            shortText.classList.add('afa-data-error-speculative');
            shortText.textContent = i18n('afa-gui-value-errorspeculative', errors.length);
        }

        const longText = document.createElement('span');
        longText.textContent = errors.map(e => e.message).join('\n');
        this.setViewContent(shortText, longText);
    }

    protected setViewContent(shortValue: HTMLElement, longValue: HTMLElement | null): void {
        this.element.textContent = '';

        this.element.appendChild(shortValue);
        if (longValue !== null) {
            const moreContainer = document.createElement('span');
            moreContainer.classList.add('afa-data-more');
            moreContainer.appendChild(longValue);
            this.element.appendChild(moreContainer);
        }
    }
}