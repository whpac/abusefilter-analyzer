import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { IView } from '../IView.js';
import { ProcessedDataView } from '../value/ProcessedDataView.js';
import { ArrayDefinitionNodeView } from './ArrayDefinitionNodeView.js';
import { AssignmentNodeView } from './AssignmentNodeView.js';
import { AtomNodeView } from './AtomNodeView.js';
import { BlockNodeView } from './BlockNodeView.js';
import { FunctionNodeView } from './FunctionNodeView.js';
import { INodeView } from './INodeView.js';
import { IndexNodeView } from './IndexNodeView.js';
import { OperatorNodeView } from './OperatorNodeView.js';

/**
 * A factory for creating views for nodes in the syntax tree.
 */
export class ViewFactory {
    private readonly dataViewFactories: DataViewFactory[] = [];

    /**
     * Creates a view for the given node and all its children.
     * @param node The node to create a view for.
     */
    public createView(node: ITreeNode): INodeView {
        const childViews: INodeView[] = [];
        for (const child of node.children) {
            childViews.push(this.createView(child));
        }

        return this.createViewWithChildren(node, childViews);
    }

    /**
     * Creates a view for the specific node and puts the children views in it.
     * @param node The node to create a view for.
     * @param childViews The already-created children views.
     */
    protected createViewWithChildren(node: ITreeNode, childViews: INodeView[]): INodeView {
        // Atoms don't use the dataView, so we can skip creating it
        if (node.type === TreeNodeType.Atom) {
            return new AtomNodeView(node);
        }

        const dataView = this.createDataView(node);
        switch (node.type) {
            case TreeNodeType.ArrayDefinition:
                return new ArrayDefinitionNodeView(node, childViews, dataView);
            case TreeNodeType.Assignment:
            case TreeNodeType.IndexAssignment:
                return new AssignmentNodeView(node, childViews, dataView);
            case TreeNodeType.ArrayIndexing:
                return new IndexNodeView(node, childViews, dataView);
            case TreeNodeType.Operator:
                return new OperatorNodeView(node, childViews, dataView);
            case TreeNodeType.FunctionCall:
                return new FunctionNodeView(node, childViews, dataView);
            default:
                return new BlockNodeView(node, childViews, dataView);
        }
    }

    /**
     * Adds a factory for creating data views for nodes.
     * If there are multiple factories specified, multiple
     * data views will be added to nodes.
     * @param factory The factory to add.
     */
    public addDataViewFactory(factory: DataViewFactory): void {
        this.dataViewFactories.push(factory);
    }

    /**
     * Creates a data view for the given node.
     * @param node The node to create a data view for.
     */
    protected createDataView(node: ITreeNode): IView {
        const dataView = new ProcessedDataView();

        for(const factory of this.dataViewFactories) {
            const view = factory(node);
            if (view !== null) {
                dataView.addView(view);
            }
        }

        return dataView;
    }
}

type DataViewFactory = (node: ITreeNode) => IView | null;