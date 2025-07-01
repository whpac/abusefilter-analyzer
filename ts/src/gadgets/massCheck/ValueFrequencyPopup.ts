import { IValue } from '../../model/value/IValue.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { ValueFormatter } from '../../gui/value/ValueFormatter.js';
import { i18n } from '../../i18n/i18n.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { EvaluationContext } from '../../evaluator/EvaluationContext.js';

export class ValueFrequencyPopup {

    public display(valueFrequencies: ValueFrequencies, errors: Error[], attachToNode: HTMLElement | null): void {
        const content = document.createElement('div');
        if (valueFrequencies.length > 0) {
            content.appendChild(this.makeMainContent(valueFrequencies));
        }
        if (valueFrequencies.length > 0 && errors.length > 0) {
            content.appendChild(document.createElement('hr'));
        }
        if (errors.length > 0) {
            content.appendChild(this.makeErrorContent(errors));
        }

        const $anchor = attachToNode ? $(attachToNode) : undefined;

        // Adjust the popup width based on the values to be shown
        const useWidePopup = valueFrequencies.some(
            entry => this.isLongValue(entry.value)
        );

        mw.loader.using(['oojs-ui-core', 'oojs-ui-widgets'], () => {
            const popup = new OO.ui.PopupWidget({
                autoClose: true,
                padded: true,
                width: useWidePopup ? window.innerWidth * 0.9 : 350,
                $content: $(content),
                $floatableContainer: $anchor,
                anchor: !!attachToNode,
                head: true,
                label: i18n('afa-masscheck-frequency-header'),
            });
            
            $(document.body).append(popup.$element);
            popup.toggle(true);
        });
    }

    protected makeMainContent(valueFrequencies: ValueFrequencies): HTMLElement {
        const container = document.createElement('ul');
        for (const entry of valueFrequencies) {
            const value = document.createElement('li');
            const timesButton = document.createElement('a');
            timesButton.href = 'javascript:void(0);';
            timesButton.textContent = i18n('afa-masscheck-frequency-times', entry.count);
            timesButton.title = i18n('afa-masscheck-frequency-times-tooltip');
            timesButton.style.color = 'inherit';
            value.appendChild(timesButton);

            value.append(' ');
            value.appendChild(ValueFormatter.formatValue(entry.value, 200));
            container.appendChild(value);

            let logLinkWrapper: HTMLElement | null = null;
            
            timesButton.addEventListener('click', () => {
                if (logLinkWrapper !== null) {
                    logLinkWrapper.remove();
                    logLinkWrapper = null;
                } else {
                    logLinkWrapper = this.createLogLinkList(entry.contexts);
                    value.appendChild(logLinkWrapper);
                }
            });
        }

        return container;
    }

    protected createLogLinkList(contexts: IEvaluationContext[]): HTMLElement {
        const logLinkWrapper = document.createElement('span');
        logLinkWrapper.classList.add('afa-masscheck-frequency-loglinks');

        contexts = contexts.filter(context => {
            const logId = context.metadata.get(EvaluationContext.METADATA_LOG_ID);
            // Filter out contexts without a log ID
            return typeof logId === 'number' && logId > 0;
        });
        // Sort from the newest (from biggest ids)
        contexts = contexts.sort((a, b) => {
            const aLogId = a.metadata.get(EvaluationContext.METADATA_LOG_ID) as number;
            const bLogId = b.metadata.get(EvaluationContext.METADATA_LOG_ID) as number;
            return bLogId - aLogId;
        });
        
        // If there are up to 10 log entries, show them all
        // Else, show initially only the first five, and allow to expand
        
        const showAllThreshold = 10;
        const showLimitedNumber = 5;
        
        const contextsToShow = contexts.length <= showAllThreshold ? contexts.length : showLimitedNumber;
        const initiallyShownContexts = contexts.slice(0, contextsToShow);
        const remainingContexts = contexts.slice(contextsToShow);
        
        let i = 0;
        for (const context of initiallyShownContexts) {
            const logLink = this.createLogLink(context);
            if (logLink === null) continue;
            
            if (i > 0) {
                logLinkWrapper.append(', ');
            }
            logLinkWrapper.appendChild(logLink);
            i++;
        }

        if (remainingContexts.length > 0) {
            const commaBeforeShowMore = document.createTextNode(', ');
            const showMoreLink = document.createElement('a');
            showMoreLink.href = 'javascript:void(0);';
            showMoreLink.textContent = i18n('afa-masscheck-frequency-loglinks-showmore');
            showMoreLink.addEventListener('click', () => {
                for (const context of remainingContexts) {
                    const logLink = this.createLogLink(context);
                    if (logLink === null) continue;
                    logLinkWrapper.append(', ');
                    logLinkWrapper.appendChild(logLink);
                }
                commaBeforeShowMore.remove();
                showMoreLink.remove();
            });
            logLinkWrapper.append(commaBeforeShowMore);
            logLinkWrapper.appendChild(showMoreLink);
        }

        return logLinkWrapper;
    }

    protected createLogLink(context: IEvaluationContext): HTMLElement | null {
        const logId = context.metadata.get(EvaluationContext.METADATA_LOG_ID) as number | undefined;
        const logDate = context.metadata.get(EvaluationContext.METADATA_LOG_DATE) as Date | undefined;
        
        if (logId === undefined) return null;
        
        const logLink = document.createElement('a');
        logLink.href = mw.util.getUrl('Special:AbuseLog/' + logId);
        logLink.textContent = logDate?.toLocaleDateString() ?? logId.toString();
        logLink.target = '_blank';
        return logLink;
    }

    protected makeErrorContent(errors: Error[]): HTMLElement {
        const container = document.createElement('div');
        container.append(i18n('afa-masscheck-frequency-errors', errors.length));

        const list = document.createElement('ul');
        container.appendChild(list);
        for (const entry of errors) {
            const value = document.createElement('li');
            value.textContent = entry.message;
            list.appendChild(value);
        }

        return container;
    }

    protected isLongValue(value: IValue): boolean {
        if (value.dataType === ValueDataType.String) {
            return (value as IValue<string>).value.length >= 40;
        } else if (value.dataType === ValueDataType.Array) {
            const arrayValue = value as IValue<IValue[]>;
            const hasPotentiallyLongValues = arrayValue.value.some(
                v => v.dataType === ValueDataType.String || v.dataType === ValueDataType.Array
            );
            if (hasPotentiallyLongValues) {
                return true;
            }
            return arrayValue.value.length >= 10;
        } else {
            // Primitive types (numbers, bools, etc.) are always considered short
            return false;
        }
    }
}

export type ValueFrequencies = {
    value: IValue,
    count: number,
    contexts: IEvaluationContext[]
}[];
