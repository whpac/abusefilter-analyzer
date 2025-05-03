import { IValue } from '../../model/value/IValue.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { ValueFormatter } from '../../gui/value/ValueFormatter.js';

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
                label: 'Value frequency',
            });
            
            $(document.body).append(popup.$element);
            popup.toggle(true);
        });
    }

    protected makeMainContent(valueFrequencies: ValueFrequencies): HTMLElement {
        const container = document.createElement('ul');
        for (const entry of valueFrequencies) {
            const value = document.createElement('li');
            value.append(`${entry.count} times: `);
            value.appendChild(ValueFormatter.formatValue(entry.value, 200));
            container.appendChild(value);
        }

        return container;
    }

    protected makeErrorContent(errors: Error[]): HTMLElement {
        const container = document.createElement('div');
        container.append(`Errors (${errors.length}): `);

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
    count: number
}[];
