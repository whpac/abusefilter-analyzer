import { ITreeNode } from '../../model/ITreeNode.js';
import { Token } from '../Token.js';
import { TreeNodeType } from '../../model/TreeNodeType.js';
import { AtomNode } from './AtomNode.js';
import { INodeFactory } from './INodeFactory.js';
import { OperatorNode } from './OperatorNode.js';
import { TokenType } from '../TokenType.js';

export class TreeNodeFactory implements INodeFactory {

    public createAtomNode(token: Token): ITreeNode {
        return new AtomNode(token);
    }

    public createOperatorNode(type: TreeNodeType, position: number, operation: string, children: ITreeNode[]): ITreeNode {
        return new OperatorNode(type, position, operation, children);
    }

    public createKeywordNode(position: number, keyword: string, children: ITreeNode[]): ITreeNode {
        children.unshift(this.createAtomNode(new Token(TokenType.StringLiteral, keyword, position, keyword.length)));
        return new OperatorNode(TreeNodeType.KeywordOperator, position, keyword, children);
    }

    public createFunctionCallNode(position: number, functionName: string, args: ITreeNode[]): ITreeNode {
        args.unshift(this.createAtomNode(new Token(TokenType.StringLiteral, functionName, position, functionName.length)));
        return new OperatorNode(TreeNodeType.FunctionCall, position, functionName, args);
    }
}