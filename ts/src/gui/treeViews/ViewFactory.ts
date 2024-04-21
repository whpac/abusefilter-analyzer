import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { IView } from '../IView.js';
import { ProcessedDataView } from '../processedData/ProcessedDataView.js';
import { ArrayDefinitionNodeView } from './ArrayDefinitionNodeView.js';
import { AssignmentNodeView } from './AssignmentNodeView.js';
import { AtomNodeView } from './AtomNodeView.js';
import { BlockNodeView } from './BlockNodeView.js';
import { FunctionNodeView } from './FunctionNodeView.js';
import { INodeView } from './INodeView.js';
import { IndexNodeView } from './IndexNodeView.js';
import { OperatorNodeView } from './OperatorNodeView.js';

export class ViewFactory {
    private readonly dataViewFactories: DataViewFactory[] = [];

    public createView(node: ITreeNode): INodeView {
        const childViews: INodeView[] = [];
        for (const child of node.children) {
            childViews.push(this.createView(child));
        }

        return this.createViewWithChildren(node, childViews);
    }

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

    public addDataViewFactory(factory: DataViewFactory): void {
        this.dataViewFactories.push(factory);
    }

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