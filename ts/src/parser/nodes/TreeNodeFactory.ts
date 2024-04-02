import { ITreeNode } from '../../model/ITreeNode.js';
import { Token } from '../Token.js';
import { TreeNodeType } from '../../model/TreeNodeType.js';
import { AtomNode } from './AtomNode.js';
import { INodeFactory } from './INodeFactory.js';
import { OperatorNode } from './OperatorNode.js';

export class TreeNodeFactory implements INodeFactory {

    public createAtomNode(token: Token): AtomNode {
        return new AtomNode(token);
    }

    public createOperatorNode(type: TreeNodeType, position: number, operation: string, children: ITreeNode[]): OperatorNode {
        return new OperatorNode(type, position, operation, children);
    }

}