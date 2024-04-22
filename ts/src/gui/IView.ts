/**
 * Represents a basic view in the GUI, that can be put into the DOM.
 */
export interface IView {

    /** Renders the HTML element, representing the view. */
    render(): HTMLElement;
}