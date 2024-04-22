import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { IView } from '../IView.js';
import { INodeView } from './INodeView.js';
import { ViewFactory } from './ViewFactory.js';

/**
 * Represents a view of the syntax tree. It will automatically create
 * the subviews for all children nodes.
 */
export class TreeView implements IView {
    protected readonly rootNodeView: INodeView;

    /**
     * @param rootNode The root node of the syntax tree.
     * @param viewFactory An object to use for constructing the children views.
     */
    public constructor(rootNode: ITreeNode, viewFactory: ViewFactory) {
        this.rootNodeView = viewFactory.createView(rootNode);
    }

    public render(): HTMLElement {
        return this.rootNodeView.render();
    }
}