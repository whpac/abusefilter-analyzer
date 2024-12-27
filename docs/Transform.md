# AbuseFilter transform module

This module is a collection of classes that can be used to perform general tree transformations. For now, it contains only one class, [`FlattenAssociativeOpsTransformer`](#flattenassociativeopstransformer-class).

## `ITreeTransformer` interface
All tree transformers are expected to implement this interface.

*See also:* [ITreeTransformer.ts](../ts/src/transform/ITreeTransformer.ts)

## `FlattenAssociativeOpsTransformer` class
A tree transformer that converts nested trees of binary operators like `+` and `&` into single nodes with multiple children. This way, nodes for such associative operators are more comprehensive for the end user to read and analyze.

This transformer does not affect the calculation of a tree. It can be invoked on both unevaluated and evaluated trees.

`FlattenAssociativeOpsTransformer` implements [`ITreeTransformer`](#itreetransformer-interface)

*See also:* [FlattenAssociativeOpsTransformer.ts](../ts/src/transform/FlattenAssociativeOpsTransformer.ts)
