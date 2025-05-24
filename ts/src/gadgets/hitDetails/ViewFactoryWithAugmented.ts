import { INodeView } from '../../gui/treeViews/INodeView.js';
import { ViewFactory } from '../../gui/treeViews/ViewFactory.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { AugmentedOperatorNodeView } from './AugmentedOperatorNodeView.js';

export class ViewFactoryWithAugmented extends ViewFactory {
    protected readonly evaluationContext: IEvaluationContext;

    public constructor(evaluationContext: IEvaluationContext) {
        super();
        this.evaluationContext = evaluationContext;
    }

    protected createViewWithChildren(node: IEvaluableTreeNode, childViews: INodeView[]): INodeView {
        if (!('getValue' in node)) {
            throw new Error('Only evaluable nodes can be used with this view factory');
        }

        const augmentedOperators = ['in', 'contains', 'like', 'matches', 'regex', 'rlike', 'irlike'];

        if (
            node.type === TreeNodeType.Operator
            && augmentedOperators.includes(node.identity.value)
        ) {
            const dataView = this.createDataView(node);
            return new AugmentedOperatorNodeView(node, childViews, dataView, this.evaluationContext);
        }

        return super.createViewWithChildren(node, childViews);
    }
}