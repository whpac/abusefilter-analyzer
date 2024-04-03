import { ITreeNode } from '../../model/ITreeNode.js';
import { Token } from '../Token.js';

/**
 * This interface is used by the parser to create new nodes in the parser tree.
 */
export interface INodeFactory {

    createAtomNode(token: Token): ITreeNode;

    createOperatorNode(identity: Token, children: ITreeNode[]): ITreeNode;

    createFunctionCallNode(identity: Token, args: ITreeNode[]): ITreeNode;

    createAssignmentNode(identity: Token, children: ITreeNode[]): ITreeNode;

    createArrayAssignmentNode(identity: Token, children: ITreeNode[]): ITreeNode;

    createArrayDefinitionNode(identity: Token, children: ITreeNode[]): ITreeNode;

    createArrayIndexingNode(identity: Token, children: ITreeNode[]): ITreeNode;
}