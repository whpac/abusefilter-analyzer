import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { IToken } from '../../model/tokens/IToken.js';
import { ValueFormatter } from '../value/ValueFormatter.js';
import { INodeView } from './INodeView.js';

export class AtomNodeView implements INodeView {
    private readonly token: IToken;
    private element: HTMLElement | null = null;

    public constructor(treeNode: ITreeNode) {
        this.token = treeNode.identity;
    }

    public render(): HTMLElement {
        if (this.element === null) {
            this.element = ValueFormatter.formatLiteral(this.token);
        }
        return this.element;
    }

    public isInline(): boolean {
        return true;
    }

    public stopsInlining(): boolean {
        return false;
    }
}