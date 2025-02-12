import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { IView } from '../IView.js';

/**
 * Represents a view for a node in the syntax tree.
 */
export interface INodeView extends IView {
    /** Syntax node that this view depicts. */
    get treeNode(): ITreeNode;

    /** All node views that represent operands of the syntax node shown using this view. */
    get children(): readonly INodeView[];

    /** Whether this node view is hidden */
    get isHidden(): boolean;

    /** Tests if this node is simple enough to be displayed inline. */
    isInline(): boolean;

    /** Should return true if this inline view is not to be included in other inline views. */
    stopsInlining(): boolean;

    /** Displays this node */
    show(): void;

    /** Hides this node, without removing it from the DOM tree */
    hide(): void;
}