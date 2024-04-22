import { ITreeNode } from '../../model/nodes/ITreeNode.js';
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

    protected renderAsInline(): HTMLElement {
        // By default it'll render as block
        return this.renderAsBlock();
    }

    protected renderAsBlock(): HTMLElement {
        const element = document.createElement('div');
        const header = this.renderBlockHeader();
        header.classList.add('afa-block-header');

        element.appendChild(header);
        element.append(' ');
        element.appendChild(this.dataView.render());

        if (this.children.length > 0) {
            const childrenListElement = document.createElement('ul');
            element.appendChild(childrenListElement);
            const hints = this.getBlockHints();
            for (let i = 0; i < this.children.length; i++) {
                const childElement = document.createElement('li');
                let hint: string | null = null;
                if (typeof hints === 'function') {
                    hint = hints(i);
                } else if (hints[i]) {
                    hint = hints[i];
                }
                
                if (hint !== null) {
                    const hintView = this.renderHintView(hint);
                    childElement.appendChild(hintView);
                }
                const childView = this.children[i];
                childElement.appendChild(childView.render());
                childrenListElement.appendChild(childElement);
            }
        }

        return element;
    }

    protected renderBlockHeader(): HTMLElement {
        const header = document.createElement('span');
        header.append(`${this.treeNode.type}(${this.treeNode.identity.type} ${this.treeNode.identity.value})`);
        return header;
    }

    protected getBlockHints(): (string | null)[] | ((index: number) => string | null) {
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