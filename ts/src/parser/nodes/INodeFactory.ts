import { ITreeNode } from '../../model/ITreeNode.js';
import { Token } from '../Token.js';
import { TreeNodeType } from '../../model/TreeNodeType.js';

/**
 * This interface is used by the parser to create new nodes in the parser tree.
 */
export interface INodeFactory {

    createAtomNode(token: Token): ITreeNode;

    createOperatorNode(type: TreeNodeType, position: number, operation: string, children: ITreeNode[]): ITreeNode;

    createKeywordNode(position: number, keyword: string, children: ITreeNode[]): ITreeNode;

    createFunctionCallNode(position: number, functionName: string, args: ITreeNode[]): ITreeNode;
}