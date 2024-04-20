import { AbuseFilter } from '../AbuseFilter.js';
import { ITreeNode } from '../model/nodes/ITreeNode.js';
import { TreeView } from './treeViews/TreeView.js';
import { ViewFactory } from './treeViews/ViewFactory.js';

export class AbuseFilterGUI {
    private readonly rootElement: HTMLElement;

    public constructor(rootElement: HTMLElement) {
        this.rootElement = rootElement;
    }

    /**
     * Renders the tree, representing the syntax of the given AbuseFilter
     * @param rootNode The root node of the syntax tree to render
     */
    public renderSyntaxTree(rootNode: AbuseFilter | ITreeNode): void {
        if (rootNode instanceof AbuseFilter) {
            rootNode = rootNode.rootNode;
        }
        
        const viewFactory = new ViewFactory();
        const rootNodeView = new TreeView(rootNode, viewFactory);
        this.rootElement.appendChild(rootNodeView.render());
    }
}