import { TreeNode } from '../TreeNode.js';
import { TreeNodeType } from '../TreeNodeType.js';

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

    /**
     * Parameters for the node. For atoms it's a single Token, while for other nodes
     * it's an array of other TreeNodes.
     */
    public readonly children: TreeNode[];


    public constructor(type: TreeNodeType, position: number, operation: string, children: TreeNode[]) {
        super(type, position);

        this.operation = operation;
        this.children = children;
    }

    public override toDebugStringInner(): string[] {
        let lines = [ this.type.toString() ];
        for (const subnode of this.children) {
            // Align sublines to the right
            const sublines = subnode.toDebugStringInner().map(
                (line: string) => '  ' + line
            );

            lines = lines.concat(sublines);
        }

        return lines;
    }
}
