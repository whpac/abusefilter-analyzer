# AbuseFilter parser module

The parser module consists of two main components: the parser and tokenizer, which are adapted from the original [AbuseFilter repository](https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/extensions/AbuseFilter/+/refs/heads/master/includes/Parser/).

The tokenizer is responsible for splitting the input sequence into an array of tokens, that are later fed to the parser. Individual tokens remember their relation to position in source code where they appeared. Tokens are kept in the syntax tree as their value is used to decide what operation is stored in that tree node.

The parser operates on a sequence of tokens and processes them according to the AbuseFilter syntax. Output of the parsing process is a tree. In order to prepare a tree suitable for user's needs, a parser has to be created with an instance of tree node factory. As a consequence, the resulting tree can consist of nodes of any type, provided that they implement the [`ITreeNode`](./Model.md#itreenode-interface) interface.

Below is an example code how the parser module can be used.

```js
const filterText = 'true | false';

const nodeFactory = new TreeNodeFactory();
const tokenizer = new Tokenizer();
const parser = new Parser(nodeFactory);

const tokens = tokenizer.tokenize(filterText);
const filterTree = parser.parse(tokens);
```

## `Parser<TNode>` class
This class transforms a sequence of tokens into a syntax tree that can be further analyzed and evaluated. The implementation itself is heavily based on the upstream parser implementation, with major changes being the rewrite to TypeScript and adaptation to data structures used in this library.

*See also:* [Parser.ts](../ts/src/parser/Parser.ts)

## `ParserException` class
A simple class representing parser exceptions.

*See also:* [ParserException.ts](../ts/src/parser/ParserException.ts)

`ParserException` extends a native `Error` class.

## `Token` class
Represents a single unit of the input data that can be meaningfully passed to the parser. Stores information about its place in the original source code.

`Token` implements the [`IToken`](Model.md#itoken-interface) interface.

*See also:* [Token.ts](../ts/src/parser/Token.ts)

## `Tokenizer` class
Essential class for AbuseFilter rule preparation before actual parsing, that converts the string representation of an expression into a sequence of tokens. The implementation is heavily based on the upstream tokenizer, with this class being its port to TypeScript and adapted to the data model of this library.

*See also:* [Tokenizer.ts](../ts/src/parser/Tokenizer.ts)

## `TreeNode` class
A simple tree node.

`TreeNode` implements [`ITreeNode`](./Model.md#itreenode-interface).

*See also:* [TreeNode.ts](../ts/src/parser/nodes/TreeNode.ts)

## `TreeNodeFactory` class
A simple tree node factory that produces [`TreeNode`](#treenode-class) instances.

`TreeNodeFactory` implements [`INodeFactory`](./Model.md#inodefactorytnode-interface).

*See also:* [TreeNodeFactory.ts](../ts/src/parser/nodes/TreeNodeFactory.ts)

