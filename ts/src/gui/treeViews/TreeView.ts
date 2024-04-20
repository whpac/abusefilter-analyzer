import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { INodeView } from './INodeView.js';
import { ViewFactory } from './ViewFactory.js';

export class TreeView {

    protected readonly rootNodeView: INodeView;

    public constructor(rootNode: ITreeNode, viewFactory: ViewFactory) {
        this.rootNodeView = viewFactory.createView(rootNode);
    }

    public render(): HTMLElement {
        return this.rootNodeView.render();
    }
}