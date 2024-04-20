export class ProcessedNodeDataView {
    protected element: HTMLElement;

    public constructor() {
        this.element = document.createElement('span');
        this.element.textContent = ' -> ...';
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}