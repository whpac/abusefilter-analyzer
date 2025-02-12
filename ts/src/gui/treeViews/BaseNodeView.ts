import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { INodeView } from './INodeView.js';

/**
 * Base class for views of nodes with children.
 */
export abstract class BaseNodeView implements INodeView {
    public readonly treeNode: ITreeNode;
    public readonly children: INodeView[];


    public get isHidden(): boolean {
        const element = this.render();
        return element.style.display === 'none';
    }

    public constructor(node: ITreeNode, childViews: INodeView[]) {
        this.treeNode = node;
        this.children = childViews;
    }

    public abstract render(): HTMLElement;

    public isInline(): boolean {
        return this.children.every(child => child.isInline() && !child.stopsInlining());
    }

    public stopsInlining(): boolean {
        return false;
    }

    public show(): void {
        const element = this.render();
        element.style.display = '';
    }

    public hide(): void {
        const element = this.render();
        element.style.display = 'none';
    }
}