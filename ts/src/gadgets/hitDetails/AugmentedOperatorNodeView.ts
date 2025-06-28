import { IView } from '../../gui/IView.js';
import { INodeView } from '../../gui/treeViews/INodeView.js';
import { OperatorNodeView } from '../../gui/treeViews/OperatorNodeView.js';
import { i18n } from '../../i18n/i18n.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { IValue } from '../../model/value/IValue.js';
import { MatchingMode, PatternExplorerPopup } from './PatternExplorerPopup.js';

export class AugmentedOperatorNodeView extends OperatorNodeView {
    protected readonly evaluationContext: IEvaluationContext;

    public constructor(node: IEvaluableTreeNode, childViews: INodeView[], dataView: IView, evaluationContext: IEvaluationContext) {
        super(node, childViews, dataView);
        this.evaluationContext = evaluationContext;
    }

    protected createTokenNode(token: string, classes: string[] = []): HTMLElement {
        const treeNode = this.treeNode as IEvaluableTreeNode;

        const element = document.createElement('button');
        element.classList.add('afa-token', 'afa-silent-button');
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
        element.append(token);

        const buttonTitle = i18n('afa-hitdetails-operatortooltip');
        // Enable the button only if the node matched anything in the current context
        element.disabled = treeNode.getValue(this.evaluationContext).isTruthy() !== true;
        if (!element.disabled) {
            element.title = buttonTitle;
        }
        treeNode.addOnValueSetCallback((_, ec) => {
            if (ec !== this.evaluationContext) return;
            element.disabled = treeNode.getValue(ec).isTruthy() !== true;
            if (!element.disabled) {
                element.title = buttonTitle;
            }
        });

        element.addEventListener('click', () => {
            this.displayPopup(element);
        });
        return element;
    }

    protected displayPopup(anchor: HTMLElement): void {
        const children = (this.treeNode as IEvaluableTreeNode).children;
        const argValues = children.map(child => child.getValue(this.evaluationContext));
        const args = this.interpretArguments(argValues, this.treeNode.identity.value);

        const popup = new PatternExplorerPopup(args.pattern, args.subject, args.mode);
        popup.display(anchor);
    }

    /**
     * Decodes the order of the arguments, depending on the operator.
     * @param values The operands of the operator
     * @param operator The operator
     * @returns Returns an object with two properties: subject (the whole tested string) and pattern (regex/glob pattern or substring)
     */
    private interpretArguments(values: IValue[], operator: string): { subject: IValue, pattern: IValue, mode: MatchingMode } {
        const modes = {
            'in': 'substring',
            'contains': 'substring',
            'like': 'glob',
            'matches': 'glob',
            'regex': 'regex',
            'rlike': 'regex',
            'irlike': 'regex-i',
        } as Record<string, MatchingMode>;
        
        if (operator === 'in') {
            return {
                subject: values[1],
                pattern: values[0],
                mode: modes[operator] as MatchingMode
            };
        } else {
            return {
                subject: values[0],
                pattern: values[1],
                mode: modes[operator] as MatchingMode
            };
        }
    }
}