import { AbuseFilter } from '../AbuseFilter.js';
import { ITreeNode } from '../model/nodes/ITreeNode.js';
import { TreeNodeView } from './syntaxTree/TreeNodeView.js';

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

        const treeElement = document.createElement('ul');
        this.rootElement.appendChild(treeElement);
        
        const rootNodeView = new TreeNodeView(rootNode);
        treeElement.appendChild(rootNodeView.render());
    }
}