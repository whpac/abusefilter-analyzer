import { IView } from '../IView.js';

/**
 * Represents a view for a node in the syntax tree.
 */
export interface INodeView extends IView {

    /** Tests if this node is simple enough to be displayed inline. */
    isInline(): boolean;

    /** Should return true if this inline view is not to be included in other inline views. */
    stopsInlining(): boolean;
}