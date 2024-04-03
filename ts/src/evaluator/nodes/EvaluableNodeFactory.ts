import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { INodeFactory } from '../../model/nodes/INodeFactory.js';
import { EvaluableTreeNode } from './EvaluableTreeNode.js';
import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { IToken } from '../../model/tokens/IToken.js';

export class EvaluableNodeFactory implements INodeFactory<IEvaluableTreeNode> {

    public createNode(type: TreeNodeType, identity: IToken, children: IEvaluableTreeNode[]): IEvaluableTreeNode {
        return new EvaluableTreeNode(type, identity, children);
    }
}