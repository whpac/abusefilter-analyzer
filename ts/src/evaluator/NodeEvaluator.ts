import { TreeNodeType } from '../model/nodes/TreeNodeType.js';
import { Value } from './value/Value.js';
import { ValueDataType } from '../model/value/ValueDataType.js';
import { VariableValue } from './value/VariableValue.js';
import { IEvaluableTreeNode } from '../model/nodes/IEvaluableTreeNode.js';
import { TokenType } from '../model/tokens/TokenType.js';
import { IEvaluationContext } from '../model/IEvaluationContext.js';
import { IValue } from '../model/value/IValue.js';
import { ValueCalculator } from './value/ValueCalculator.js';
import { ValueStringOperations } from './value/ValueStringOperations.js';
import { ValueComparer } from './value/ValueComparer.js';
import { LocalFunctionExecutor } from './functions/LocalFunctionExecutor.js';
import { IFunctionExecutor } from './functions/IFuctionExecutor.js';

/**
 * Class responsible for evaluating nodes of the syntax tree.
 */
export class NodeEvaluator {
    /** An object that will be used to execute functions in the filter */
    protected readonly functionExecutor: IFunctionExecutor;

    public constructor(functionExecutor?: IFunctionExecutor) {
        this.functionExecutor = functionExecutor ?? new LocalFunctionExecutor();
    }

    /**
     * Evaluates the node and all its children if needed.
     * @param treeNode The tree node to be evaluated
     * @param evaluationContext The context of evaluation, containing all the variables and functions
     */
    public async evaluateNode(treeNode: IEvaluableTreeNode, evaluationContext: IEvaluationContext): Promise<IValue> {
        let value;

        try {
            // Atoms store value literals and variable reads
            if (treeNode.type === TreeNodeType.Atom) {
                const identity = treeNode.identity;
                if (identity.type === TokenType.Identifier) {
                    // Get variable value
                    value = evaluationContext.getVariable(identity.value);
                } else {
                    // Else, convert the literal into a value
                    value = Value.fromTokenLiteral(identity);
                }
            } else {
                // Evaluate this node
                value = await this.evaluateNodeLazily(treeNode, evaluationContext);
            }

            // Set the value only on success, so handlers don't have to check order of events
            treeNode.setValue(evaluationContext, value);
        } catch (e) {
            // Unevaluated nodes have value of undefined so return it from the function as well
            value = Value.Undefined;

            const error = (e instanceof Error) ? e : new Error('' + e);
            treeNode.setError(evaluationContext, error);
        }
        return value;
    }

    /**
     * For logical AND and OR operators evaluates only as many operands as needed
     * (others will be evaluated in a speculative mode). For other operators,
     * it's equivalent to `evaluateNodeGreedily`.
     * 
     * The resulting promise is resolved as soon as the result is known, however the
     * execution of remaining nodes in continued in a speculative mode.
     * 
     * @param treeNode The tree node to be evaluated
     * @param context The evaluation context
     */
    protected async evaluateNodeLazily(treeNode: IEvaluableTreeNode, context: IEvaluationContext): Promise<IValue> {
        if (treeNode.identity.value == '&') {
            return this.evaluateLogicalOperatorLazily(treeNode.children, context, true);
        } else if (treeNode.identity.value == '|') {
            return this.evaluateLogicalOperatorLazily(treeNode.children, context, false);
        }

        return this.evaluateNodeGreedily(treeNode, context);
    }

    /**
     * Evaluates all the subnodes first and then calculates the node value. This is not for AtomNodes.
     * @param treeNode The tree node to be evaluated
     * @param context The evaluation context
     */
    protected async evaluateNodeGreedily(treeNode: IEvaluableTreeNode, context: IEvaluationContext): Promise<IValue> {
        if (treeNode.type == TreeNodeType.Atom) {
            throw new Error('Cannot evaluate an atom node greedily. Use EvaluatedTreeNode.evaluate instead.');
        }

        // The only node that can't be evaluated using a standard greedy execution is a conditional node
        const nodeType = treeNode.type;
        const tokenValue = treeNode.identity.value;
        if (nodeType == TreeNodeType.Operator && ['?', 'if'].includes(tokenValue)) {
            return this.evaluateConditionalOperatorLazily(treeNode.children, context);
        }

        // This is a greedy evaluation so we can calculate all the children first
        // and then the parent value. The order of evaluation is important (eg. because of variables)
        // but all nodes will use the same context, as there's no speculative execution here.
        const values = [];
        for (const child of treeNode.children) {
            const value = await this.evaluateNode(child, context);
            values.push(value);
        }

        switch (nodeType) {
            case TreeNodeType.Operator:
                return this.calculateOperatorNodeResult(tokenValue, values);
            case TreeNodeType.Assignment:
                return this.calculateAssignmentResult(context, values);
            case TreeNodeType.IndexAssignment:
                return this.calculateIndexAssignmentResult(values);
            case TreeNodeType.ArrayIndexing:
                return this.calculateArrayIndexingResult(values);
            case TreeNodeType.FunctionCall:
                return await this.calculateFunctionCallResult(context, tokenValue, values);
            case TreeNodeType.ArrayDefinition:
                return this.calculateArrayDefinitionResult(values);
        }

        // If we got here, the node type is not supported
        throw new Error(`Unsupported node type: ${nodeType}`);
    }

    /**
     * Evaluates a tree node corresponding to a logical AND or OR operator.
     * The evaluation is done lazily, so that only as many operands are evaluated as needed.
     * However, the rest of them is still evaluated in a speculative mode.
     * 
     * @param operands The operands to be evaluated
     * @param context The evaluation context to use for this evaluation
     * @param neutralElement A neutral element of the logical operation (true for AND, false for OR)
     * @returns A promise representing the result of the logical operation
     */
    protected async evaluateLogicalOperatorLazily(operands: readonly IEvaluableTreeNode[], context: IEvaluationContext, neutralElement: boolean): Promise<IValue> {
        return new Promise((resolve, reject) => {
            const lastOperand = operands[operands.length - 1];

            let wasResolved = false;
            let hasUndefined = false;
            let lastIterationPromise = Promise.resolve();
            for (const operand of operands) {
                lastIterationPromise = lastIterationPromise.then(() => 
                    this.evaluateNode(operand, context).then((value) => {
                        if (value.isUndefined) {
                            // We don't really want to treat undefined as true or false
                            // It's just an undefined value
                            hasUndefined = true;
                        }

                        // The non-neutral operand value is returned as-is if it's not last
                        // eg. (0 & true) == 0 but (true & 0) == false
                        // eg. (1 | false) == 1 but (false | 1) == true
                        if (operand == lastOperand) {
                            if(!wasResolved) {
                                const lastValue = value.asBoolean();
                                if (hasUndefined && value.isTruthy() === neutralElement) {
                                    resolve(Value.Undefined);
                                } else {
                                    resolve(lastValue);
                                }
                            }
                            wasResolved = true;
                        } else if (value.isTruthy() !== neutralElement && value.dataType !== ValueDataType.Undefined) {
                            // Undefined never resolves the node
                            // Resolve the whole node, but still keep evaluating other operands
                            if (!wasResolved) resolve(value);
                            wasResolved = true;
            
                            // Create a new evaluation context, so that the subsequent operands will not
                            // tamper with variable values
                            context = context.createChildContext();
                        }
                    })
                ).catch((e) => {
                    // Explicitly propagate the error
                    // It breaks the evaluation but errors should not happen
                    // during evaluation of syntax tree
                    console.error(e);
                    if (!wasResolved) {
                        wasResolved = true;
                        reject(e);
                    }
                });
            }
        });
    }

    /**
     * Evaluates a tree node corresponding to a conditional operator.
     * The evaluation is done lazily, so that only one of the two branches is calculated.
     * However, the other one is still evaluated in a speculative mode.
     * 
     * @param operands The operands to be evaluated
     * @param context The evaluation context to use for this evaluation
     * @returns A promise representing the result of the conditional operation
     */
    protected async evaluateConditionalOperatorLazily(operands: readonly IEvaluableTreeNode[], context: IEvaluationContext): Promise<IValue> {
        const condition = operands[0];
        const ifTrue = operands[1];
        const ifFalse = (operands.length > 2) ? operands[2] : null;

        const conditionValue = await this.evaluateNode(condition, context);
        const childContext = context.createChildContext();

        // Evaluate both branches, but one in a speculative mode
        if (conditionValue.isTruthy()) {
            if (ifFalse !== null) {
                this.evaluateNode(ifFalse, childContext);
            }
            return await this.evaluateNode(ifTrue, context);
        } else {
            this.evaluateNode(ifTrue, childContext);
            if (ifFalse === null) {
                return Value.Null;
            }
            return await this.evaluateNode(ifFalse, context);
        }
    }

    /**
     * Accepts a set of already computed values for the operator's operands
     * and calculates the result of the operator using them.
     * 
     * @param operator The operator to be calculated
     * @param values The operands to be used in the calculation
     * @returns A value of the calculation
     */
    protected calculateOperatorNodeResult(operator: string, values: IValue[]): IValue {
        const left = values[0];
        const right = values[1];

        switch (operator) {
            case ';':
                return values[values.length - 1];
            case '&':
                return ValueCalculator.and(values);
            case '|':
                return ValueCalculator.or(values);
            case '^':
                return ValueCalculator.xor(values);
            case '!':
                return ValueCalculator.not(left);
            case '=':
            case '==':
                return ValueComparer.isLooselyEqualTo(left, right);
            case '!=':
                return ValueComparer.isLooselyInequalTo(left, right);
            case '===':
                return ValueComparer.isStrictlyEqualTo(left, right);
            case '!==':
                return ValueComparer.isStrictlyInequalTo(left, right);
            case '<':
                return ValueComparer.isLessThan(left, right);
            case '<=':
                return ValueComparer.isLessThanOrEqualTo(left, right);
            case '>':
                return ValueComparer.isGreaterThan(left, right);
            case '>=':
                return ValueComparer.isGreaterThanOrEqualTo(left, right);
            case '+':
                // Plus can be unary or binary but both are handled the same way
                return ValueCalculator.addValues(values);
            case '-':
                // Minus can be unary or binary
                return (right !== undefined) ?
                    ValueCalculator.subtract(left, right) :
                    ValueCalculator.negate(left);
            case '*':
                return ValueCalculator.multiplyValues(values);
            case '/':
                return ValueCalculator.divide(left, right);
            case '%':
                return ValueCalculator.modulo(left, right);
            case '**':
                return ValueCalculator.pow(left, right);
            case 'in':
                return ValueStringOperations.contains(right, left);
            case 'contains':
                return ValueStringOperations.contains(left, right);
            case 'like':
            case 'matches':
                return ValueStringOperations.testGlob(left, right);
            case 'irlike':
                return ValueStringOperations.testRegex(left, right, true);
            case 'rlike':
            case 'regex':
                return ValueStringOperations.testRegex(left, right);
        }

        // If we got here, the operator is unknown
        throw new Error(`Unrecognized operator: ${operator}`);
    }

    /**
     * Performs an assignment of a new value to a variable and returns the new value.
     * @param context The evaluation context where to save the variable
     * @param values Operands of the assignment (variable and new value)
     * @returns The assigned value
     */
    protected calculateAssignmentResult(context: IEvaluationContext, values: IValue[]): IValue {
        const variable = values[0];
        const newValue = values[1];

        if (!(variable instanceof VariableValue)) {
            throw new Error('Left-hand side of an assignment must be a variable');
        }

        context.setVariable(variable.name, newValue);
        return newValue;
    }

    /**
     * Performs an assignment of a new value to an index of an array and returns the new value.
     * If there's no index provided, the new value is appended to the array.
     * @param values Operands of the index assignment (array, new value, index)
     * @returns The assigned value
     */
    protected calculateIndexAssignmentResult(values: IValue[]): IValue {
        const array = values[0];
        const newValue = values[1];
        if (values.length == 2) {
            array.appendElement(newValue);
        } else {
            const index = values[2];
            array.setElementAt(index, newValue);
        }
        return newValue;
    }

    /**
     * Returns a value at the specified index in the array.
     * @param values The operands of array indexing (array, index)
     * @returns A value at the specified index in the array
     */
    protected calculateArrayIndexingResult(values: IValue[]): IValue {
        const array = values[0];
        const index = values[1];

        return array.getElementAt(index);
    }

    /**
     * Invokes a specified function and returns the result.
     * @param context The evaluation context
     * @param func Function name
     * @param values Function arguments
     * @returns The function call result
     */
    protected async calculateFunctionCallResult(context: IEvaluationContext, func: string, values: IValue[]): Promise<IValue> {
        return this.functionExecutor.executeFunction(func, context, values);
    }

    /**
     * Creates a new array value from the provided values.
     * @param values Values to be stored in the newly created array
     * @returns The created array
     */
    protected calculateArrayDefinitionResult(values: IValue[]): Value {
        return new Value(ValueDataType.Array, values);
    }
}