# AbuseFilter evaluator module

The evaluator module reflects the way how the original AbuseFilter calculates values of expressions. It is used to process a syntax tree into a value that will be the result of the relevant expression.

The evaluator records all the intermediate values in [`EvaluableTreeNode`](../ts/src/evaluator/nodes/EvaluableTreeNode.ts)s, so that it's possible to inspect the whole tree later in order to analyze how the values were derived.

Almost all functions and operations available in the upstream are implemented client-side in the evaluator. The only exception is the `ccnorm` function, for which a request to the remote MediaWiki instance will be made.

Below is an example code how the parser module can be used.

```js
const abuseFilter = new AbuseFilter('true | false');
const filterTree = abuseFilter.getRootNode();

// The below operations are in fact implemented in the AbuseFilter class
// In real scenario, there would be no reason to type them by hand
const functionExecutor = new LocalFunctionExecutor();
const evaluator = new NodeEvaluator(functionExecutor);
const context = new EvaluationContext();
await evaluator.evaluateNode(filterTree, context);
```

## `EvaluationContext` class
Evaluation context is an object that represents an outer world state during the filter evaluation. It's responsible for introducing and storing variables, as well as provides a means of guarding results of speculative execution from leaking into the true evaluation path.

Evaluation context can form a hierarchy, where the original one is considered a root and contexts can cave their children. All changes made in the child context do not propagate upwards in the tree.

`EvaluationContext` implements the [`IEvaluationContext`](./Model.md#ievaluationcontext-interface) interface.

*See also:* [EvaluationContext.ts](../ts/src/evaluator/EvaluationContext.ts)

## `NodeEvaluator` class
A main class that orchestrates processing of the syntax tree. It's responsible for invoking the evaluation of nodes using a proper evaluation context and manages the speculative execution.

For every operation, it dispatches processing to the relevant class.

*See also:* [NodeEvaluator.ts](../ts/src/evaluator/NodeEvaluator.ts)

## `CCNormProvider` class
Takes care of normalization of confusible characters, based on a conversion table loaded from JSON.

*See also:* [CCNormProvider.ts](../ts/src/evaluator/functions/CCNormProvider.ts)

## `IFunctionExecutor` interface
Interface for a function executor. It is responsible for dispatching function calls to the appropriate function implementation. The actual function execution can happen either locally or at a remote machine, for instance a MediaWiki server.

*See also:* [IFunctionExecutor.ts](../ts/src/evaluator/functions/IFuctionExecutor.ts)

## `LocalFunctionExecutor` class
Function executor that looks a function up in the local function registry and executes it. Uses functions defined in the AbuseFilterFunctions class.

`LocalFunctionExecutor` implements the [`IFunctionExecutor`](#ifunctionexecutor-interface) interface

*See also:* [LocalFunctionExecutor.ts](../ts/src/evaluator/functions/LocalFuctionExecutor.ts)

## `AbuseFilterFunctions` class
Contains a collection of functions that are available in the abuse filters. Implements all functions except `ccnorm` and those depending on it.

*See also:* [AbuseFilterFunctions.ts](../ts/src/evaluator/functions/AbuseFilterFunctions.ts)

## `EvaluableNodeFactory` class
A simple factory that creates instances of `EvaluableTreeNode` class.

`EvaluableNodeFactory` implements the [`INodeFactory`](./Model.md#inodefactorytnode-interface) interface

*See also:* [EvaluableNodeFactory.ts](../ts/src/evaluator/nodes/EvaluableNodeFactory.ts)

## `EvaluableTreeNode` class
Represents a node in the abstract syntax tree that can store values and errors from evaluations. The node can be evaluated more than once with different contexts; it can store multiple sets of values and errors.

`EvaluableTreeNode` implements the [`IEvaluableTreeNode`](./Model.md#ievaluabletreenode-interface) interface

*See also:* [EvaluableTreeNode.ts](../ts/src/evaluator/nodes/EvaluableTreeNode.ts)

## `Value` class
A class representing a value in the evaluation tree. It has a value-type semantics and therefore is immutable.

`Value` implements the [`IValue`](./Model.md#ivaluetvalue-interface) interface

*See also:* [Value.ts](../ts/src/evaluator/value/Value.ts)

## `VariableValue` class
Represents a variable value, that can be used as a l-value in assignments.

`VariableValue` implements the [`IVariableValue`](./Model.md#ivariablevaluetvalue-interface) interface

*See also:* [VariableValue.ts](../ts/src/evaluator/value/VariableValue.ts)

## `ValueCalculator` class
A static class that provides methods for performing arithmetic and logical operations on values.

*See also:* [ValueCalculator.ts](../ts/src/evaluator/value/ValueCalculator.ts)

## `ValueComparer` class
A static class that provides methods for comparing values.

*See also:* [ValueComparer.ts](../ts/src/evaluator/value/ValueComparer.ts)

## `ValueConverter` class
A static class that provides methods for type converions. These methods resemble PHP's type juggling and behavior of the upstream AbuseFilter extension.

*See also:* [ValueConverter.ts](../ts/src/evaluator/value/ValueConverter.ts)

## `ValueStringOperations` class
A static class that provides string operations for values.

*See also:* [ValueStringOperations.ts](../ts/src/evaluator/value/ValueStringOperations.ts)

## `IPAddress` class
Represents an IP address. It's used in calculations that refer to the network adresses.

*See also:* [IPAddress.ts](../ts/src/evaluator/utils/IPAddress.ts)

## `IPUtils` class
A static class that provides operations on IP addresses and ranges.

*See also:* [IPUtils.ts](../ts/src/evaluator/utils/IPUtils.ts)

## `RegexUtils` class
Utility class for processing PCRE regular expressions. Wraps the `PcreParser`, providing a convenient method for translating PCRE regexes to ECMA ones.

*See also:* [RegexUtils.ts](../ts/src/evaluator/utils/regex/RegexUtils.ts)

## `PcreParser` class
Provides a service of parsing PCRE-compliant regex strings and further converting them to ECMA-compliant regex strings. Should be used through `RegexUtils` class.

*See also:* [PcreParser.ts](../ts/src/evaluator/utils/regex/PcreParser.ts)
