import { INodeView } from '../treeViews/INodeView.js';

export interface ITreeFilter {
    /** Filter name that can be displayed in the UI */
    get name(): string;
    /** Filter description that can be displayed in the UI */
    get description(): string;

    /**
     * Initializes the filter, by setting up any necessary data structures
     * and event listeners. Will be called once before any calls to `apply`.
     * @param nodeView The root node view of the tree view to initialize the filter for.
     * @param reapplyFilter A callback to reapply the filter after changes occur to the tree view.
     */
    initialize(nodeView: INodeView, reapplyFilter: () => void): void;

    /**
     * Applies the filter, hiding irrelevant nodes in the tree view.
     * Should assume that initially all nodes are visible and shouldn't
     * show the nodes, as this filter may be applied after another filter.
     * Should iterate by itself over all children of the node view.
     * @param nodeView The node view to apply the filter to
     */
    apply(nodeView: INodeView): void;
}