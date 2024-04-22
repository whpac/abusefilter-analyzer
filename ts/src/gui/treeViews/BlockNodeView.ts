import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { INodeView } from './INodeView.js';
import { IView } from '../IView.js';

/**
 * Base class for views of nodes with children.
 */
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

    /** Renders the node in inline mode */
    protected renderAsInline(): HTMLElement {
        // By default it'll render as block
        return this.renderAsBlock();
    }

    /** Renders the node in block mode */
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

    /** Prepares an element for the block header */
    protected renderBlockHeader(): HTMLElement {
        const header = document.createElement('span');
        header.append(`${this.treeNode.type}(${this.treeNode.identity.type} ${this.treeNode.identity.value})`);
        return header;
    }

    /**
     * Returns hints to be used when displaying this node.
     * Hints can be either specified as an array or there can
     * be a generator function returned.
     */
    protected getBlockHints(): (string | null)[] | ((index: number) => string | null) {
        return [];
    }

    /**
     * Renders an element for the hint.
     * @param hint The hint to render.
     */
    protected renderHintView(hint: string): HTMLElement {
        const element = document.createElement('span');
        element.classList.add('afa-hint');
        element.append(hint);
        return element;
    }

    /**
     * Renders the token as an element.
     * @param token The token string to display
     * @param classes Additional CSS classes to apply
     */
    protected createTokenNode(token: string, classes: string[] = []): HTMLElement {
        const element = document.createElement('span');
        element.classList.add('afa-token');
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
        element.append(token);
        return element;
    }
}