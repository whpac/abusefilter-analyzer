import { i18n } from '../../i18n/i18n.js';
import { IToken } from '../../model/tokens/IToken.js';
import { TokenType } from '../../model/tokens/TokenType.js';
import { IValue } from '../../model/value/IValue.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';

export class ValueFormatter {

    /**
     * Prepares a value to be displayed in the GUI. For some data types, a maximum length can be specified.
     * Values that are too long will be truncated an a button to expand the value will be shown.
     * @param value The value to pretty-print
     * @param maxLength The maximum length of the string to be displayed.
     */
    public static formatValue(value: IValue, maxLength?: number): HTMLElement {
        switch (value.dataType) {
            case ValueDataType.Undefined:
                return this.formatKeyword('undefined');
            case ValueDataType.Null:
                return this.formatKeyword('null');
            case ValueDataType.Boolean:
                return this.formatKeyword(value.isTruthy() ? 'true' : 'false');
            case ValueDataType.Integer:
            case ValueDataType.Float:
                return this.formatNumberLiteral(value.asString().value!);
            case ValueDataType.String:
                return this.formatStringLiteral((value as IValue<string>).value, maxLength);
            case ValueDataType.Array:
                return this.processArrayValue(value as IValue<IValue[]>);
        }
    }

    public static formatLiteral(token: IToken): HTMLElement {
        switch(token.type) {
            case TokenType.Identifier: {
                const wrapper = this.makeWrapper('identifier');
                wrapper.textContent = token.value;
                return wrapper;
            }
            case TokenType.StringLiteral:
                return ValueFormatter.formatStringLiteral(token.value);
            case TokenType.IntLiteral:
            case TokenType.FloatLiteral:
                return ValueFormatter.formatNumberLiteral(token.value);
            case TokenType.Keyword:
                return ValueFormatter.formatKeyword(token.value);
        }
        throw new Error(i18n('afa-gui-value-unknowntoken', token.type));
    }

    private static makeWrapper(dataType: string): HTMLElement {
        const wrapper = document.createElement('span');
        wrapper.classList.add('afa-value', 'afa-value-' + dataType);
        return wrapper;
    }

    private static formatKeyword(value: string): HTMLElement {
        const wrapper = this.makeWrapper('keyword');
        wrapper.textContent = value;

        if (value === 'true') {
            wrapper.classList.add('afa-value-bool', 'afa-value-true');
        } else if (value === 'false') {
            wrapper.classList.add('afa-value-bool', 'afa-value-false');
        }
        return wrapper;
    }

    private static formatNumberLiteral(value: string): HTMLElement {
        const wrapper = this.makeWrapper('number');
        wrapper.textContent = value;
        return wrapper;
    }

    private static formatStringLiteral(value: string, maxLength?: number): HTMLElement {
        const wrapper = this.makeWrapper('string');
        const escapedValue = this.escapeString(value);

        if (maxLength !== undefined && value.length > maxLength) {
            wrapper.append('"');

            const truncatedValue = escapedValue.substring(0, maxLength);
            const contentTextNode = document.createTextNode(truncatedValue);
            wrapper.appendChild(contentTextNode);
            
            const expandButton = this.createInlayButton('»', () => {
                contentTextNode.textContent = escapedValue;
                expandButton.style.display = 'none';
                collapseButton.style.display = '';
            });
            expandButton.title = i18n('afa-gui-value-expand', escapedValue.length);
            const collapseButton = this.createInlayButton('←', () => {
                contentTextNode.textContent = truncatedValue;
                expandButton.style.display = '';
                collapseButton.style.display = 'none';
            });
            collapseButton.style.display = 'none';
            collapseButton.title = i18n('afa-gui-value-collapse');

            wrapper.appendChild(expandButton);
            wrapper.append('"');
            wrapper.appendChild(collapseButton);
        } else {
            wrapper.textContent = `"${escapedValue}"`;
        }

        return wrapper;
    }

    private static processArrayValue(value: IValue<IValue[]>): HTMLElement {
        const wrapper = this.makeWrapper(value.dataType);
        wrapper.appendChild(document.createTextNode('['));

        const array = value.value;
        for (let i = 0; i < array.length; i++) {
            if (i > 0) {
                wrapper.appendChild(document.createTextNode(', '));
            }
            wrapper.appendChild(this.formatValue(array[i]));
        }

        wrapper.appendChild(document.createTextNode(']'));
        return wrapper;
    }

    private static createInlayButton(caption: string, clickHandler: () => void): HTMLButtonElement {
        const button = document.createElement('button');
        button.classList.add('afa-value-inlay-button');
        button.textContent = caption;
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            clickHandler();
        });
        return button;
    }

    /** Escapes special characters in a string for display in double quotes */
    public static escapeString(value: string): string {
        return value
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
    }
}