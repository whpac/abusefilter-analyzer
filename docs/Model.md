# AbuseFilter model module

The model module does not contain executable code and therefore is not included in the distributed JavaScript code. Here are collected interfaces and enums that are reused by other modules.

## `ITreeNode` interface
Tree node is a building block of the parser tree. AbuseFilter rules are transformed into a tree of nodes, where each node represents a single operation or value. All nodes higher in the tree depend on the values of their children.

*See also:* [ITreeNode.ts](../ts/src/model/nodes/ITreeNode.ts)

## `IEvaluableTreeNode` interface
Evaluable tree node is a type of tree node that can store values produced by the operators and functions in the tree. This is useful for calculation of the filter result. These nodes can store multiple values, e.g. for different sets of variables specified in the same filter.

`IEvaluableTreeNode` extends [`ITreeNode`](#itreenode-interface).

*See also:* [IEvaluableTreeNode.ts](../ts/src/model/nodes/IEvaluableTreeNode.ts)

## `INodeFactory<TNode>` interface
This interface represents an object that abstracts the creation of syntax tree nodes. It can be used to generically create node, no matter of its exact type.

*See also:* [INodeFactory.ts](../ts/src/model/nodes/INodeFactory.ts)

## `TreeNodeType` enum
This is an enumeration that represents distinct types of tree nodes that can be present in the syntax tree. The node type is one of the factors that determine the interpretation of the node.

*See also:* [TreeNodeType.ts](../ts/src/model/nodes/TreeNodeType.ts)

## `IToken` interface
Token is a basic unit of filter source code that can be understood by the rule parser. It is characterized by its type and the value that appeared in the code.

*See also:* [IToken.ts](../ts/src/model/tokens/IToken.ts)

## `TokenType` enum
This is an enumeration that represents distinct types of tokens that can appear in the filter text. Token types are categories used subsequently by the parser to properly create the output syntax tree.

*See also:* [TokenType.ts](../ts/src/model/tokens/TokenType.ts)

## `IValue<TValue>` interface
This interface represents values that can exist during the evaluation of a filter. Values have the same properties as their counterparts in the upstream, especially with respect to type conversions.

*See also:* [IValue.ts](../ts/src/model/value/IValue.ts)

## `IVariableValue<TValue>` interface
Represents a value, that apart from being a normal value, can be assigned to (aka. *l-value*). These values are used to represent variables.

`IVariableValue` extends [`IValue`](#ivaluetvalue-interface).

*See also:* [IVariableValue.ts](../ts/src/model/value/IVariableValue.ts)

## `ValueDataType` enum
This enumeration is used to keep track of what is the data type of a given value. Due to JavaScript supporting narrower set of native data types than AbuseFilter, this information is kept explicitly.

All the types listed below, except the last, exist in the upstream. `Undefined` has been added to represent
values that cannot be computed, due to e.g. errors in the preceding statements. There is no way of putting
undefined value explicitly into the filter text.

All code that operates on values, should treat them in exactly the same way as AbuseFilter does. This
includes implicit following most PHP behaviors, like type conversions. The only exception to this rule
is the undefined type which has to be treated as an indefinite value.

*See also:* [ValueDataType.ts](../ts/src/model/value/ValueDataType.ts)

## `IEvaluationContext` interface
Evaluation context is an object that represents an outer world state during the filter evaluation. It's responsible for introducing and storing variables, as well as provides a means of guarding results of speculative execution from leaking into the true evaluation path.

Evaluation context can form a hierarchy, where the original one is considered a root and contexts can cave their children. All changes made in the child context should not propagate upwards in the tree.

*See also:* [IEvaluationContext.ts](../ts/src/model/IEvaluationContext.ts)
