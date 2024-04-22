import { IEvaluationContext } from '../model/IEvaluationContext.js';
import { IEvaluableTreeNode } from '../model/nodes/IEvaluableTreeNode.js';
import { ITreeNode } from '../model/nodes/ITreeNode.js';
import { TreeView } from './treeViews/TreeView.js';
import { ViewFactory } from './treeViews/ViewFactory.js';
import { NodeValueView } from './value/NodeValueView.js';

export class AbuseFilterGUI {
    /** Whether to include the node values after evaluation (if available). */
    public displayEvaluatedValues: boolean = true;

    private readonly rootElement: HTMLElement;

    public constructor(rootElement: HTMLElement) {
        this.rootElement = rootElement;
        this.rootElement.classList.add('afa-tree-container');
    }

    /**
     * Renders the tree, representing the syntax of the given AbuseFilter
     * @param rootNode The root node of the syntax tree to render
     */
    public renderSyntaxTree(rootNode: ITreeNode): void;
    public renderSyntaxTree(rootNode: IEvaluableTreeNode, evaluationContext: IEvaluationContext): void;
    public renderSyntaxTree(rootNode: ITreeNode, evaluationContext?: IEvaluationContext): void {
        const viewFactory = new ViewFactory();
        if (evaluationContext !== undefined && this.displayEvaluatedValues) {
            viewFactory.addDataViewFactory(
                (node) => 'getValue' in node ? new NodeValueView(node as IEvaluableTreeNode, evaluationContext!) : null
            );
        }

        const rootNodeView = new TreeView(rootNode, viewFactory);
        this.rootElement.appendChild(rootNodeView.render());
    }
}