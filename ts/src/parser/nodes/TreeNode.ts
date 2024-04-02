import { ITreeNode } from '../../model/ITreeNode.js';
import { TreeNodeType } from '../../model/TreeNodeType.js';

/**
 * Represents a single node in the parser tree. It chan contain other nodes or simple values.
 * 
 * Based on https://phabricator.wikimedia.org/diffusion/EABF/browse/master/includes/Parser/AFPTreeNode.php
 */
export abstract class TreeNode implements ITreeNode {

    /** Type of this node */
    public readonly type: TreeNodeType;

    /**
     * The position of the node in the source code, used for error reporting.
     */
    public readonly position: number;

    /**
     * Parameters for the node. For atoms it's a single Token, while for other nodes
     * it's an array of other TreeNodes.
     */
    public readonly children: ITreeNode[];


    public constructor(type: TreeNodeType, position: number, children: ITreeNode[] = []) {
        this.type = type;
        this.position = position;
        this.children = children;
    }

    /**
     * Returns a string representation of the node and its children, suitable for debugging.
     */
    public toDebugString(): string {
        return this.toDebugStringInner().join('\n');
    }

    protected toDebugStringInner(): string[] {
        let lines = [ this.type.toString() ];
        for (const subnode of this.children) {
            if(!(subnode instanceof TreeNode)) {
                lines.push('  ' + subnode.toString());
                continue;
            }

            // Align sublines to the right
            const sublines = subnode.toDebugStringInner().map(
                (line: string) => '  ' + line
            );

            lines = lines.concat(sublines);
        }

        return lines;
    }
}
