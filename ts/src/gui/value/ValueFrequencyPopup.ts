import { IValue } from '../../model/value/IValue.js';
import { ValueFormatter } from './ValueFormatter.js';

export class ValueFrequencyPopup {

    public display(valueFrequencies: ValueFrequencies, attachToNode: HTMLElement | null): void {
        const popupContent = this.makeContent(valueFrequencies);
        const $anchor = attachToNode ? $(attachToNode) : undefined;

        mw.loader.using(['oojs-ui-core', 'oojs-ui-widgets'], () => {
            const popup = new OO.ui.PopupWidget({
                autoClose: true,
                padded: true,
                width: window.innerWidth * 0.9,
                $content: $(popupContent),
                $floatableContainer: $anchor,
                anchor: !!attachToNode,
                head: true,
                label: 'Value frequency',
            });
            
            $(document.body).append(popup.$element);
            popup.toggle(true);
        });
    }

    protected makeContent(valueFrequencies: ValueFrequencies): HTMLElement {
        const container = document.createElement('ul');
        for (const entry of valueFrequencies) {
            const value = document.createElement('li');
            value.append(`${entry.count} times: `);
            value.appendChild(ValueFormatter.formatValue(entry.value));
            container.appendChild(value);
        }

        return container;
    }
}

export type ValueFrequencies = {
    value: IValue,
    count: number
}[];
