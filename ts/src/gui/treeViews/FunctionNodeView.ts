import { BlockNodeView } from './BlockNodeView.js';

export class FunctionNodeView extends BlockNodeView {
    protected canInline = true;

    protected renderAsInline(): HTMLElement {
        const element = document.createElement('span');

        element.appendChild(this.createTokenNode(this.treeNode.identity.value, ['afa-function']));

        element.appendChild(this.createTokenNode('('));
        element.appendChild(this.children[0].render());
        for (let i = 1; i < this.children.length; i++) {
            element.appendChild(this.createTokenNode(', '));
            element.appendChild(this.children[i].render());
        }
        element.appendChild(this.createTokenNode(')'));

        element.append(' ');
        element.appendChild(this.dataView.render());
        return element;
    }

    public stopsInlining(): boolean {
        return true;
    }

    protected renderBlockHeader(): HTMLElement {
        const element = document.createElement('span');
        element.append('Call function ');
        element.append(this.createTokenNode(this.treeNode.identity.value, ['afa-function']));
        return element;
    }

    protected getBlockHints(): (string | null)[] | ((index: number) => string) {
        // We only provide hints for functions with more than one argument.
        // Unary functions are usually self-explanatory.
        const functionName = this.treeNode.identity.value;
        switch (functionName) {
            case 'ccnorm_contains_any':
            case 'ccnorm_contains_all':
            case 'contains_any':
            case 'contains_all':
                return (index) => index === 0 ? 'haystack' : `needle ${index}`;
            case 'count':
                return this.children.length === 2 ? ['needle', 'haystack'] : ['string'];
            case 'rcount':
            case 'get_matches':
                return this.children.length === 2 ? ['regex', 'subject'] : ['string'];
            case 'ip_in_range':
                return ['ip', 'range'];
            case 'ip_in_ranges':
                return (index) => index === 0 ? 'ip' : `range ${index}`;
            case 'equals_to_any':
                return (index) => index === 0 ? 'tested' : `value ${index}`;
            case 'substr':
                return ['string', 'start', 'length'];
            case 'str_replace':
                return ['string', 'search', 'replaceBy'];
            case 'str_replace_regexp':
                return ['string', 'regex', 'replaceBy'];
            case 'set':
            case 'set_var':
                return ['variable', 'value'];
            default:
                return [];
        }
    }
}