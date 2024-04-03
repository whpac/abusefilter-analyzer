import { ITreeNode } from '../../model/ITreeNode.js';
import { Token } from '../Token.js';
import { TreeNodeType } from '../../model/TreeNodeType.js';
import { INodeFactory } from './INodeFactory.js';
import { TreeNode } from './TreeNode.js';

export class TreeNodeFactory implements INodeFactory {

    public createAtomNode(token: Token): ITreeNode {
        return new TreeNode(TreeNodeType.Atom, token, []);
    }

    public createOperatorNode(identity: Token, children: ITreeNode[]): ITreeNode {
        return new TreeNode(TreeNodeType.Operator, identity, children);
    }

    public createFunctionCallNode(identity: Token, args: ITreeNode[]): ITreeNode {
        return new TreeNode(TreeNodeType.FunctionCall, identity, args);
    }

    public createAssignmentNode(identity: Token, children: ITreeNode[]): ITreeNode {
        return new TreeNode(TreeNodeType.Assignment, identity, children);
    }

    public createArrayAssignmentNode(identity: Token, children: ITreeNode[]): ITreeNode {
        return new TreeNode(TreeNodeType.IndexAssignment, identity, children);
    }

    public createArrayDefinitionNode(identity: Token, children: ITreeNode[]): ITreeNode {
        return new TreeNode(TreeNodeType.ArrayDefinition, identity, children);
    }

    public createArrayIndexingNode(identity: Token, children: ITreeNode[]): ITreeNode {
        return new TreeNode(TreeNodeType.ArrayIndexing, identity, children);
    }
}