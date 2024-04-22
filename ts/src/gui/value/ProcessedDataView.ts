import { IView } from '../IView.js';

export class ProcessedDataView {
    protected element: HTMLElement;

    public constructor() {
        this.element = document.createElement('span');
        this.element.classList.add('afa-data');
    }

    public addView(view: IView): void {
        this.element.appendChild(view.render());
    }

    public render(): HTMLElement {
        return this.element;
    }
}