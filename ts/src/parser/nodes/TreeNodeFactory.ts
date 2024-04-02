import { Token } from '../Token.js';
import { TreeNodeType } from '../TreeNodeType.js';
import { AtomNode } from './AtomNode.js';
import { INodeFactory } from './INodeFactory.js';
import { OperatorNode } from './OperatorNode.js';
import { TreeNode } from './TreeNode.js';

export class TreeNodeFactory implements INodeFactory {

    public createAtomNode(token: Token): AtomNode {
        return new AtomNode(token);
    }

    public createOperatorNode(type: TreeNodeType, position: number, operation: string, children: TreeNode[]): OperatorNode {
        return new OperatorNode(type, position, operation, children);
    }

}