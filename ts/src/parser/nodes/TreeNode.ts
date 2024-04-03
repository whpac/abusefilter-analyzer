import { ITreeNode } from '../../model/ITreeNode.js';
import { TreeNodeType } from '../../model/TreeNodeType.js';
import { Token } from '../Token.js';

/**
 * Represents a single node in the parser tree. It chan contain other nodes or simple values.
 * 
 * Based on https://phabricator.wikimedia.org/diffusion/EABF/browse/master/includes/Parser/AFPTreeNode.php
 */
export class TreeNode implements ITreeNode {

    /** Type of this node */
    public readonly type: TreeNodeType;

    /** Token that decides on the exact node semantics, e.g. operator, identifier etc. */
    public readonly identity: Token;

    /**
     * Parameters for the node. For atoms it's a single Token, while for other nodes
     * it's an array of other TreeNodes.
     */
    public readonly children: ITreeNode[];


    public constructor(type: TreeNodeType, identity: Token, children: ITreeNode[] = []) {
        this.type = type;
        this.identity = identity;
        this.children = children;
    }

    /**
     * Returns a string representation of the node and its children, suitable for debugging.
     */
    public toDebugString(): string {
        return this.toDebugStringInner().join('\n');
    }

    protected toDebugStringInner(): string[] {
        let lines = [ `${this.type.toString()}(${this.identity.type} ${this.identity.value})` ];
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
