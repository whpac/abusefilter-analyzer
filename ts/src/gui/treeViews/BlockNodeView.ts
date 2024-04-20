import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { INodeView } from './INodeView.js';
import { ProcessedNodeDataView } from './ProcessedNodeDataView.js';

export class BlockNodeView implements INodeView {
    protected readonly treeNode: ITreeNode;
    protected readonly children: INodeView[];
    protected element: HTMLElement | null = null;
    protected canInline: boolean = false;

    public constructor(node: ITreeNode, childViews: INodeView[]) {
        this.treeNode = node;
        this.children = childViews;
    }

    public render(): HTMLElement {
        if (this.element === null) {
            this.element = this.prepareElement();
        }
        return this.element;
    }

    public isInline(): boolean {
        if (!this.canInline) return false;
        return this.children.every(child => child.isInline() && !child.stopsInlining());
    }

    public stopsInlining(): boolean {
        return false;
    }

    private prepareElement(): HTMLElement {
        const nodeElement = document.createElement('div');

        let nodeIdentity = `(${this.treeNode.identity.type} ${this.treeNode.identity.value})`;
        switch (this.treeNode.type) {
            // Skip identity for certain node types when it's not useful
            case TreeNodeType.Assignment:
            case TreeNodeType.ArrayDefinition:
                nodeIdentity = '';
                break;
            // Function names will always be identifiers
            case TreeNodeType.FunctionCall:
                nodeIdentity = `(${this.treeNode.identity.value})`;
                break;
        }

        const header = document.createTextNode(this.treeNode.type + nodeIdentity);
        nodeElement.append(header);

        const processedDataView = new ProcessedNodeDataView();
        nodeElement.appendChild(processedDataView.getElement());

        if (this.children.length > 0) {
            const childrenListElement = document.createElement('ul');
            nodeElement.appendChild(childrenListElement);
            for (const childView of this.children) {
                const childElement = document.createElement('li');
                childElement.appendChild(childView.render());
                childrenListElement.appendChild(childElement);
            }
        }

        return nodeElement;
    }
}