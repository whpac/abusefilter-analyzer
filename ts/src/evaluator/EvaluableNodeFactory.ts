import { ITreeNode } from '../model/ITreeNode.js';
import { TreeNodeType } from '../model/TreeNodeType.js';
import { INodeFactory } from '../model/INodeFactory.js';
import { EvaluableTreeNode } from './EvaluableTreeNode.js';
import { IEvaluableTreeNode } from '../model/IEvaluableTreeNode.js';
import { IToken } from '../model/IToken.js';

export class EvaluableNodeFactory implements INodeFactory {

    public createNode(type: TreeNodeType, identity: IToken, children: ITreeNode[]): ITreeNode {
        for (const child of children) {
            if (!('setValue' in child)) {
                throw new Error('EvaluableNodeFactory can only create evaluable nodes');
            }
        }
        return new EvaluableTreeNode(type, identity, children as IEvaluableTreeNode[]);
    }
}