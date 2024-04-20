import { ITreeNode } from '../../model/nodes/ITreeNode.js';
import { TreeNodeType } from '../../model/nodes/TreeNodeType.js';
import { ValueFormatter } from '../value/ValueFormatter.js';

export class TreeNodeView {
    private treeNode: ITreeNode;
    private element: HTMLElement | null = null;
    private valueHolder: HTMLElement | null = null;

    public constructor(treeNode: ITreeNode) {
        this.treeNode = treeNode;
    }

    public render(): HTMLElement {
        if (this.element === null) {
            this.element = this.prepareElement();
        }
        return this.element;
    }

    private prepareElement(): HTMLElement {
        const nodeElement = document.createElement('li');
        const header = this.makeHeader(this.treeNode);
        if (!Array.isArray(header)) {
            nodeElement.append(header);
        } else {
            nodeElement.append(...header);
        }

        // Atomic nodes don't need to hve their children printed
        if (this.isAtomicNode(this.treeNode)) {
            return nodeElement;
        }

        this.valueHolder = this.makeValueHolder();
        nodeElement.appendChild(this.valueHolder);

        if (this.treeNode.children.length > 0) {
            const childrenElement = document.createElement('ul');
            nodeElement.appendChild(childrenElement);
            for (const child of this.treeNode.children) {
                const childView = new TreeNodeView(child);
                childrenElement.appendChild(childView.render());
            }
        }

        return nodeElement;
    }

    protected makeHeader(node: ITreeNode): Node | Node[] {
        if (this.isAtomicNode(node)) {
            return this.makeHeaderForAtomicNode(node);
        }

        let nodeIdentity = `(${node.identity.type} ${node.identity.value})`;
        switch (node.type) {
            // Skip identity for certain node types when it's not useful
            case TreeNodeType.Assignment:
            case TreeNodeType.ArrayDefinition:
                nodeIdentity = '';
                break;
            // Function names will always be identifiers
            case TreeNodeType.FunctionCall:
                nodeIdentity = `(${node.identity.value})`;
                break;
        }

        return document.createTextNode(`${node.type}${nodeIdentity} -> `);
    }

    protected makeValueHolder(): HTMLElement {
        const valueHolder = document.createElement('span');
        valueHolder.textContent = '...';
        return valueHolder;
    }

    private isAtomicNode(node: ITreeNode): boolean {
        if (node.type === TreeNodeType.Atom) return true;
        if (node.type === TreeNodeType.ArrayDefinition) {
            // We don't want to have nested arrays as atomics
            for (const child of node.children) {
                if (!this.isAtomicNode(child)
                    || child.type === TreeNodeType.ArrayDefinition) return false;
            }
            return true;
        }
        if (node.type === TreeNodeType.Assignment) {
            for (const child of node.children) {
                if (!this.isAtomicNode(child)) return false;
            }
            return true;
        }
        if (node.type === TreeNodeType.Operator && node.children.length == 1) {
            for (const child of node.children) {
                if (!this.isAtomicNode(child)) return false;
            }
            return true;
        }
        return false;
    }

    private makeHeaderForAtomicNode(node: ITreeNode): Node[] {
        switch (node.type) {
            case TreeNodeType.Atom:
                return [ ValueFormatter.formatLiteral(node.identity) ];
            case TreeNodeType.ArrayDefinition: {
                const elements = node.children.map((child) => child.identity);
                return [ ValueFormatter.formatLiteralArray(elements) ];
            }
            case TreeNodeType.Assignment:
                return [
                    ...this.makeHeaderForAtomicNode(node.children[0]),
                    document.createTextNode(' := '),
                    ...this.makeHeaderForAtomicNode(node.children[1])
                ];
            case TreeNodeType.Operator:
                if (node.children.length === 1) {
                    return [
                        document.createTextNode(node.identity.value),
                        ...this.makeHeaderForAtomicNode(node.children[0])
                    ];
                } else {
                    const result = [];
                    for (let i = 0; i < node.children.length; i++) {
                        if (i > 0) {
                            result.push(document.createTextNode(` ${node.identity.value} `));
                        }
                        result.push(...this.makeHeaderForAtomicNode(node.children[i]));
                    }
                }
        }
        throw new Error('Unknown atomic tree node type');
    }
}