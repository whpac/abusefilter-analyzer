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

            const logLinkWrapper = document.createElement('span');
            logLinkWrapper.classList.add('afa-masscheck-frequency-loglinks');
            logLinkWrapper.style.display = 'none';
            value.appendChild(logLinkWrapper);

            let i = 0;
            // Sort from the newest (from biggest ids)
            const contexts = entry.contexts.sort((a, b) => {
                const aLogId = a.metadata.get(EvaluationContext.METADATA_LOG_ID) as number | undefined;
                const bLogId = b.metadata.get(EvaluationContext.METADATA_LOG_ID) as number | undefined;
                if (aLogId !== undefined && bLogId !== undefined) {
                    return bLogId - aLogId;
                }
                return 0; // for undefined it's irrelevant, they will be removed anyway
            });
            for (const context of contexts) {
                const logId = context.metadata.get(EvaluationContext.METADATA_LOG_ID) as number | undefined;
                const logDate = context.metadata.get(EvaluationContext.METADATA_LOG_DATE) as Date | undefined;
                
                if (logId === undefined) continue;
                
                if (i > 0) {
                    logLinkWrapper.append(', ');
                }
                const logLink = document.createElement('a');
                logLink.href = mw.util.getUrl('Special:AbuseLog/' + logId);
                logLink.textContent = logDate?.toLocaleDateString() ?? logId.toString();
                logLink.target = '_blank';
                logLinkWrapper.appendChild(logLink);
                i++;
            }

            timesButton.addEventListener('click', () => {
                if (logLinkWrapper.style.display === 'none') {
                    logLinkWrapper.style.display = 'block';
                } else {
                    logLinkWrapper.style.display = 'none';
                }
            });
        }

        return container;
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
