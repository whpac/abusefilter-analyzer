import { Token } from '../Token.js';
import { TreeNodeType } from '../TreeNodeType.js';
import { AtomNode } from './AtomNode.js';
import { OperatorNode } from './OperatorNode.js';
import { TreeNode } from './TreeNode.js';

/**
 * This interface is used by the parser to create new nodes in the parser tree.
 */
export interface INodeFactory {

    createAtomNode(token: Token): AtomNode;

    createOperatorNode(type: TreeNodeType, position: number, operation: string, children: TreeNode[]): OperatorNode;
}