import { i18n } from '../../i18n/i18n.js';
import { BlockNodeView } from './BlockNodeView.js';

export class OperatorNodeView extends BlockNodeView {
    protected canInline = true;

    protected renderAsInline(): HTMLElement {
        const element = document.createElement('span');

        if (this.arity === 1) {
            element.append(this.createTokenNode(this.treeNode.identity.value, ['afa-operator']));
            element.appendChild(this.children[0].render());
        } else {
            let getOperator: (index: number) => string = () => this.treeNode.identity.value;

            if (['if', '?'].includes(this.treeNode.identity.value)) {
                getOperator = (index: number) => index === 1 ? '?' : ':';
            }

            element.appendChild(this.children[0].render());
            for (let i = 1; i < this.children.length; i++) {
                const operator = getOperator(i);
                const isKeyword = /^[a-z]+$/i.test(operator);
                const nodeClass = isKeyword ? 'afa-keyword' : 'afa-operator';
                element.append(this.createTokenNode(' ' + getOperator(i) + ' ', [nodeClass]));
                element.appendChild(this.children[i].render());
            }

            // We do it only for non-unary operators because those are trivial to understand
            element.append(' ');
            element.appendChild(this.dataView.render());
        }
        return element;
    }

    public stopsInlining(): boolean {
        return this.arity > 1;
    }

    public get arity(): number {
        return this.children.length;
    }

    protected renderBlockHeader(): HTMLElement {
        const operator = this.treeNode.identity.value;
        const element = document.createElement('span');

        if (operator === ';') {
            element.append(i18n('afa-gui-node-sequence'));
        } else {
            const isKeyword = /^[a-z]+$/i.test(operator);
            const nodeClass = isKeyword ? 'afa-keyword' : 'afa-operator';
            element.append(i18n('afa-gui-node-operator'), ' ');
            element.append(this.createTokenNode(operator, [nodeClass]));
        }
        return element;
    }

    protected getBlockHints(): string[] {
        // TODO: Similarly to FunctionNodeView, should these be localized?
        const operator = this.treeNode.identity.value;
        switch (operator) {
            case 'in':
                return ['needle', 'haystack'];
            case 'contains':
                return ['haystack', 'needle'];
            case 'like':
            case 'matches':
                return ['subject', 'glob'];
            case 'regex':
            case 'rlike':
            case 'irlike':
                return ['subject', 'regex'];
            case '?':
            case 'if':
                return ['test', 'ifTrue', 'ifFalse'];
        }
        return [];
    }
}