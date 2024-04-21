import { IView } from '../IView.js';

export interface INodeView extends IView {

    /** Tests if this node is simple enough to be displayed inline. */
    isInline(): boolean;

    /** Should return true if this inline view is not to be included in other inline views. */
    stopsInlining(): boolean;
}