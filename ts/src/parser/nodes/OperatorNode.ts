import { TreeNode } from './TreeNode.js';
import { TreeNodeType } from '../../model/TreeNodeType.js';
import { ITreeNode } from '../../model/ITreeNode.js';

/**
 * A node representing operator. Consists of a string representing the operation
 * and array of child nodes for operands. The number of elements in array depends
 * on the particular operator semantics.
 */
export class OperatorNode extends TreeNode {

    /**
     * The operation this node represents. It can be a operator, function name, etc.
     */
    public readonly operation: string;


    public constructor(type: TreeNodeType, position: number, operation: string, children: ITreeNode[]) {
        super(type, position, children);

        this.operation = operation;
    }
}
