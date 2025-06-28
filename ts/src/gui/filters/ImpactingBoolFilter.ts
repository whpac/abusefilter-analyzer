import { i18n } from '../../i18n/i18n.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { INodeView } from '../treeViews/INodeView.js';
import { ITreeFilter } from './ITreeFilter.js';

/**
 * Implements a node view filter that hides nodes with boolean values
 * that do not impact the result of the filter.
 * For example, for (true & true & false), only the last will be shown.
 */
export class ImpactingBoolFilter implements ITreeFilter {
    public get name() {
        return i18n('afa-gui-filter-bool-name');
    }
    public get description() {
        return i18n('afa-gui-filter-bool-desc');
    }

    protected readonly relevantEvaluationContext: IEvaluationContext;

    public constructor(evaluationContext: IEvaluationContext) {
        this.relevantEvaluationContext = evaluationContext;
    }

    public initialize(nodeView: INodeView, reapply: () => void): void {
        const node = nodeView.treeNode;
        if (!('getValue' in node)) {
            return;
        }

        this.listenForChanges(node as IEvaluableTreeNode, reapply);
    }

    protected listenForChanges(nodeView: IEvaluableTreeNode, callback: () => void) {
        nodeView.addOnValueSetCallback(callback);
        nodeView.addOnErrorCallback(callback);

        for (const child of nodeView.children) {
            this.listenForChanges(child, callback);
        }
    }

    public apply(nodeView: INodeView): void {
        if (!('getValue' in nodeView.treeNode)) {
            // Don't filter out non-evaluable nodes
            return;
        }
        
        // Inline nodes can be only shown or collapsed as a whole
        // Don't enter into them
        if (nodeView.isInline()) {
            return;
        }
        
        for (const child of nodeView.children) {
            this.apply(child);
        }
        
        const treeNode = nodeView.treeNode as IEvaluableTreeNode;
        this.hideInsignificantChildren(treeNode, nodeView);
        this.hideWithNoVisibleChildren(nodeView);
    }

    protected hideInsignificantChildren(node: IEvaluableTreeNode, view: INodeView) {
        const nodeType = node.type;
        const nodeToken = node.identity;

        if (nodeType != TreeNodeType.Operator) return;

        switch (nodeToken.value) {
            case '&':
                this.hideInsignificantAndChildren(node, view);
                break;
            case '|':
                this.hideInsignificantOrChildren(node, view);
                break;
        }
    }

    protected hideInsignificantAndChildren(node: IEvaluableTreeNode, view: INodeView) {
        const parentValue = node.getValue(this.relevantEvaluationContext);
        if (parentValue.isTruthy() !== false) {
            // If the parent is true, keep all children visible
            // They are all significant, even though true is recessive for AND
            return;
        }

        for (const child of view.children) {
            if (child.isHidden || !('getValue' in child.treeNode)) {
                continue;
            }

            const childNode = child.treeNode as IEvaluableTreeNode;
            const childValue = childNode.getValue(this.relevantEvaluationContext);
            if (childValue.isTruthy() === true) {
                child.hide();
            }
        }
    }

    protected hideInsignificantOrChildren(node: IEvaluableTreeNode, view: INodeView) {
        const parentValue = node.getValue(this.relevantEvaluationContext);
        if (parentValue.isTruthy() !== true) {
            // If the parent is false, keep all children visible
            // They are all significant, even though false is recessive for OR
            return;
        }

        for (const child of view.children) {
            if (child.isHidden || !('getValue' in child.treeNode)) {
                continue;
            }

            const childNode = child.treeNode as IEvaluableTreeNode;
            const childValue = childNode.getValue(this.relevantEvaluationContext);
            if (childValue.isTruthy() === false) {
                child.hide();
            }
        }
    }

    protected hideWithNoVisibleChildren(view: INodeView) {
        if (view.children.length === 0) {
            return;
        }

        // There's no point in showing child-less nodes
        if (view.children.every(child => child.isHidden)) {
            view.hide();
        }
    }
}