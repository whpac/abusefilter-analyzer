import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { ValueFormatter } from '../value/ValueFormatter.js';
import { BaseNodeView } from './BaseNodeView.js';

/**
 * A view for an atom node in the syntax tree.
 */
export class AtomNodeView extends BaseNodeView {
    private element: HTMLElement | null = null;

    public constructor(treeNode: ITreeNode) {
        super(treeNode, []);
    }

    public render(): HTMLElement {
        if (this.element === null) {
            this.element = ValueFormatter.formatLiteral(this.treeNode.identity);
        }
        return this.element;
    }

    public isInline(): boolean {
        return true;
    }
}