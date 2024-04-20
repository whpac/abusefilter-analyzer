import { ValueFormatter } from '../value/ValueFormatter.js';
import { BlockNodeView } from './BlockNodeView.js';

export class ArrayDefinitionNodeView extends BlockNodeView {
    protected canInline = true;

    public render(): HTMLElement {
        if (!this.isInline()) return super.render();

        if (this.element === null) {
            const elements = this.children.map((child) => child.render());
            this.element = ValueFormatter.wrapAsArray(elements);
        }
        return this.element;
    }
}