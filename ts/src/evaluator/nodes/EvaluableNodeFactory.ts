import { TreeNodeType } from '../../model/TreeNodeType.js';
import { INodeFactory } from '../../model/INodeFactory.js';
import { EvaluableTreeNode } from './EvaluableTreeNode.js';
import { IEvaluableTreeNode } from '../../model/IEvaluableTreeNode.js';
import { IToken } from '../../model/IToken.js';

export class EvaluableNodeFactory implements INodeFactory<IEvaluableTreeNode> {

    public createNode(type: TreeNodeType, identity: IToken, children: IEvaluableTreeNode[]): IEvaluableTreeNode {
        return new EvaluableTreeNode(type, identity, children);
    }
}