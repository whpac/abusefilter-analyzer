import { IToken } from '../../model/tokens/IToken.js';
import { TokenType } from '../../model/tokens/TokenType.js';
import { IValue } from '../../model/value/IValue.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';

export class ValueFormatter {

    /**
     * Prepares a value to be displayed in the GUI
     * @param value The value to pretty-print
     */
    public static formatValue(value: IValue): HTMLElement {
        switch (value.dataType) {
            case ValueDataType.Undefined:
            case ValueDataType.Null:
            case ValueDataType.Boolean:
                return this.formatKeyword(value.toString());
            case ValueDataType.Integer:
            case ValueDataType.Float:
                return this.formatNumberLiteral(value.toString());
            case ValueDataType.String:
                return this.formatStringLiteral(value.toString());
            case ValueDataType.Array:
                return this.processArrayValue(value);
        }
    }

    public static formatLiteral(token: IToken): Node {
        switch(token.type) {
            case TokenType.Identifier:
                return document.createTextNode(token.value);
            case TokenType.StringLiteral:
                return ValueFormatter.formatStringLiteral(token.value);
            case TokenType.IntLiteral:
            case TokenType.FloatLiteral:
                return ValueFormatter.formatNumberLiteral(token.value);
            case TokenType.Keyword:
                return ValueFormatter.formatKeyword(token.value);
        }
        throw new Error('Unknown token type');
    }

    public static formatLiteralArray(tokens: readonly IToken[]): HTMLElement {
        const wrapper = this.makeWrapper('array');
        wrapper.appendChild(document.createTextNode('['));

        for (let i = 0; i < tokens.length; i++) {
            if (i > 0) {
                wrapper.appendChild(document.createTextNode(', '));
            }
            wrapper.appendChild(this.formatLiteral(tokens[i]));
        }

        wrapper.appendChild(document.createTextNode(']'));
        return wrapper;
    }

    public static formatKeyword(value: string): HTMLElement {
        const wrapper = this.makeWrapper('keyword');
        wrapper.textContent = value;
        return wrapper;
    }

    public static formatStringLiteral(value: string): HTMLElement {
        const wrapper = this.makeWrapper('string');
        const escapedValue = value
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
        wrapper.textContent = `"${escapedValue}"`;
        return wrapper;
    }

    public static formatNumberLiteral(value: string): HTMLElement {
        const wrapper = this.makeWrapper('number');
        wrapper.textContent = value;
        return wrapper;
    }

    private static makeWrapper(dataType: string): HTMLElement {
        const wrapper = document.createElement('span');
        wrapper.classList.add('afa-value', 'afa-value-' + dataType);
        return wrapper;
    }

    private static processArrayValue(value: IValue): HTMLElement {
        const wrapper = this.makeWrapper(value.dataType);
        wrapper.appendChild(document.createTextNode('['));

        const array = value.toArray();
        for (let i = 0; i < array.length; i++) {
            if (i > 0) {
                wrapper.appendChild(document.createTextNode(', '));
            }
            wrapper.appendChild(this.formatValue(array[i]));
        }

        wrapper.appendChild(document.createTextNode(']'));
        return wrapper;
    }
}