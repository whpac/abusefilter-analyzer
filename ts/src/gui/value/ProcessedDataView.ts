import { IView } from '../IView.js';

/**
 * A view for displaying all the data associated with a node.
 */
export class ProcessedDataView {
    protected element: HTMLElement;

    public constructor() {
        this.element = document.createElement('span');
        this.element.classList.add('afa-data');
    }

    /**
     * Adds a new view to this one.
     * @param view The view to add to this view.
     */
    public addView(view: IView): void {
        this.element.appendChild(view.render());
    }

    public render(): HTMLElement {
        return this.element;
    }
}