import { Token } from '../Token.js';
import { TreeNode } from './TreeNode.js';
import { TreeNodeType } from '../TreeNodeType.js';

/**
 * A node representing nullary operator, that is an atom.
 * It stores only the atom value.
 */
export class AtomNode extends TreeNode {
    /** The token that's wrapped into this atom */
    public readonly token: Token;

    public constructor(token: Token) {
        super(TreeNodeType.Atom, token.startPosition);

        this.token = token;
    }

    /** The value of the underlying token */
    public get tokenValue() {
        return this.token.value;
    }

    /** The type of the underlying token */
    public get tokenType() {
        return this.token.type;
    }

    protected override toDebugStringInner(): string[] {
        const token = this.token;
        return [ `Atom(${token.type} ${token.value})` ];
    }
}

