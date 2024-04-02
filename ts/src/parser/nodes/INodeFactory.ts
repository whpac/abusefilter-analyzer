import { ITreeNode } from '../../model/ITreeNode.js';
import { Token } from '../Token.js';
import { TreeNodeType } from '../../model/TreeNodeType.js';
import { AtomNode } from './AtomNode.js';
import { OperatorNode } from './OperatorNode.js';

/**
 * This interface is used by the parser to create new nodes in the parser tree.
 */
export interface INodeFactory {

    createAtomNode(token: Token): AtomNode;

    createOperatorNode(type: TreeNodeType, position: number, operation: string, children: ITreeNode[]): OperatorNode;
}