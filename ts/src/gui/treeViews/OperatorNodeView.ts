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

    protected getBlockHints(): string[] {
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
        }
        return [];
    }
}