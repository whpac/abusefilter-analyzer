import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { INodeView } from './INodeView.js';
import { IView } from '../IView.js';

export class BlockNodeView implements INodeView {
    protected readonly treeNode: ITreeNode;
    protected readonly children: INodeView[];
    protected readonly dataView: IView;
    protected canInline: boolean = false;
    private element: HTMLElement | null = null;

    public constructor(node: ITreeNode, childViews: INodeView[], dataView: IView) {
        this.treeNode = node;
        this.children = childViews;
        this.dataView = dataView;
    }

    public render(): HTMLElement {
        if (this.element === null) {
            this.element = this.isInline() ? this.renderAsInline() : this.renderAsBlock();
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

    protected renderAsBlock(): HTMLElement {
        const header = this.renderBlockHeader();

        if (this.children.length > 0) {
            const childrenListElement = document.createElement('ul');
            header.appendChild(childrenListElement);
            const hints = this.getBlockHints();
            for (let i = 0; i < this.children.length; i++) {
                const childElement = document.createElement('li');
                if (hints[i]) {
                    const hintView = this.renderHintView(hints[i]);
                    childElement.appendChild(hintView);
                }
                const childView = this.children[i];
                childElement.appendChild(childView.render());
                childrenListElement.appendChild(childElement);
            }
        }

        return header;
    }

    protected renderAsInline(): HTMLElement {
        // By default it'll render as block
        return this.renderAsBlock();
    }

    protected renderBlockHeader(): HTMLElement {
        const element = document.createElement('div');

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

        element.append(this.treeNode.type + nodeIdentity);
        element.appendChild(this.dataView.render());
        return element;
    }

    protected getBlockHints(): string[] {
        return [];
    }

    protected renderHintView(hint: string): HTMLElement {
        const element = document.createElement('span');
        element.classList.add('afa-hint');
        element.append(hint);
        return element;
    }

    protected createTokenNode(value: string, classes: string[] = []): HTMLElement {
        const element = document.createElement('span');
        element.classList.add('afa-token');
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
        element.append(value);
        return element;
    }
}