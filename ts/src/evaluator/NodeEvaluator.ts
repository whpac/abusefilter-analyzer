import { TreeNodeType } from '../parser/TreeNodeType.js';
import { OperatorNode } from '../parser/nodes/OperatorNode.js';
import { EvaluatedTreeNode } from './EvaluatedTreeNode.js';
import { EvaluationContext } from './EvaluationContext.js';
import { Value } from './Value.js';
import { ValueDataType } from './ValueDataType.js';
import { VariableValue } from './VariableValue.js';

export class NodeEvaluator {
    /** An array of keywords that are supported as operators */
    public static readonly operatorKeywords = [
        'in', 'like', 'contains', 'matches', 'rlike', 'irlike', 'regex',
    ];
    
    /**
     * Evaluates all the subnodes first and then calculates the node value. This is not for AtomNodes.
     * @param treeNode The tree node to be evaluated
     * @param context The evaluation context
     */
    public async evaluateNodeGreedily(treeNode: EvaluatedTreeNode, context: EvaluationContext): Promise<Value> {
        if (treeNode.node.type == TreeNodeType.Atom) {
            throw new Error('Cannot evaluate an atom node greedily. Use EvaluatedTreeNode.evaluate instead.');
        }

        // The only node that can't be evaluated using a standard greedy execution is a conditional node
        const operatorNode = treeNode.node as OperatorNode;
        if (operatorNode.type == TreeNodeType.Conditional) {
            return this.evaluateConditionalOperatorLazily(treeNode.children, context);
        }

        // This is a greedy evaluation so we can calculate all the children first
        // and then the parent value. The order of evaluation is important (eg. because of variables)
        // but all nodes will use the same context, as there's no speculative execution here.
        for (const child of treeNode.children) {
            await child.evaluate(context, this);
        }

        const values = treeNode.children.map((child) => child.value);

        const nodeType = operatorNode.type;
        const operation = operatorNode.operation;

        switch (nodeType) {
            case TreeNodeType.Semicolon:
                return this.calculateSemicolonResult(values);
            case TreeNodeType.Assignment:
                return this.calculateAssignmentResult(context, values);
            case TreeNodeType.IndexAssignment:
                return this.calculateIndexAssignmentResult(values);
            case TreeNodeType.ArrayAppend:
                return this.calculateArrayAppendResult(values);
            case TreeNodeType.Logic:
                return this.calculateLogicResult(values, operation);
            case TreeNodeType.Compare:
                return this.calculateCompareResult(values, operation);
            case TreeNodeType.ArithmeticAdditive:
                return this.calculateArithmeticAdditiveResult(values, operation);
            case TreeNodeType.ArithmeticMultiplicative:
                return this.calculateArithmeticMultiplicativeResult(values, operation);
            case TreeNodeType.Exponentiation:
                return this.calculateExponentiationResult(values);
            case TreeNodeType.BooleanNegation:
                return this.calculateBooleanNegationResult(values);
            case TreeNodeType.KeywordOperator:
                return this.calculateKeywordOperatorResult(values, operation);
            case TreeNodeType.ArithmeticUnary:
                return this.calculateArithmeticUnaryResult(values, operation);
            case TreeNodeType.ArrayIndexing:
                return this.calculateArrayIndexingResult(values);
            case TreeNodeType.FunctionCall:
                return await this.calculateFunctionCallResult(context, operation, values);
            case TreeNodeType.ArrayDefinition:
                return this.calculateArrayDefinitionResult(values);
        }

        // If we got here, the node type is not supported
        throw new Error(`Unsupported node type: ${nodeType}`);
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
    public async evaluateNodeLazily(treeNode: EvaluatedTreeNode, context: EvaluationContext): Promise<Value> {
        if (treeNode.node.type == TreeNodeType.Logic) {
            const operatorNode = treeNode.node as OperatorNode;
            if (operatorNode.operation == '&') {
                return this.evaluateLogicalOperatorLazily(treeNode.children, context, true);
            }
            else if (operatorNode.operation == '|') {
                return this.evaluateLogicalOperatorLazily(treeNode.children, context, false);
            }
        }
        return this.evaluateNodeGreedily(treeNode, context);
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
    protected async evaluateLogicalOperatorLazily(operands: EvaluatedTreeNode[], context: EvaluationContext, neutralElement: boolean): Promise<Value> {
        return new Promise((resolve, reject) => {
            const lastOperand = operands[operands.length - 1];

            let wasResolved = false;
            let lastIterationPromise = Promise.resolve();
            for (const operand of operands) {
                lastIterationPromise = lastIterationPromise.then(() => 
                    operand.evaluate(context, this).then(() => {
                        const value = operand.value;
    
                        // The non-neutral operand value is returned as-is if it's not last
                        // eg. (0 & true) == 0 but (true & 0) == false
                        // eg. (1 | false) == 1 but (false | 1) == true
                        if (operand == lastOperand) {
                            if(!wasResolved) resolve(value.asBoolean());
                            wasResolved = true;
                        } else if (value.isTruthy() !== neutralElement) {
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

    protected async evaluateConditionalOperatorLazily(operands: EvaluatedTreeNode[], context: EvaluationContext): Promise<Value> {
        const condition = operands[0];
        const ifTrue = operands[1];
        const ifFalse = operands[2] ?? null;

        await condition.evaluate(context, this);
        const childContext = context.createChildContext();

        // Evaluate both branches, but one in a speculative mode
        if (condition.value.isTruthy()) {
            ifFalse?.evaluate(childContext, this);
            await ifTrue.evaluate(context, this);
            return ifTrue.value;
        } else {
            ifTrue.evaluate(childContext, this);
            await ifFalse?.evaluate(context, this);
            return ifFalse?.value ?? Value.Null;
        }
    }

    protected calculateSemicolonResult(values: Value[]): Value {
        const lastValue = values[values.length - 1];
        return lastValue;
    }

    protected calculateAssignmentResult(context: EvaluationContext, values: Value[]): Value {
        const variable = values[0];
        const newValue = values[1];

        if (!(variable instanceof VariableValue)) {
            throw new Error('Left-hand side of an assignment must be a variable');
        }

        context.setVariable(variable.name, newValue);
        return newValue;
    }

    protected calculateIndexAssignmentResult(values: Value[]): Value {
        const array = values[0];
        const index = values[1];
        const newValue = values[2];
        array.setElementAt(index, newValue);
        return newValue;
    }

    protected calculateArrayAppendResult(values: Value[]): Value {
        const array = values[0];
        const newValue = values[1];
        array.appendElement(newValue);
        return newValue;
    }

    // Conditional operator cannot be evaluated greedily

    protected calculateLogicResult(values: Value[], operation: string): Value {
        switch (operation) {
            case '&':
                return Value.and(values);
            case '|':
                return Value.or(values);
            case '^':
                return Value.xor(values);
            default:
                throw new Error(`Unknown logical operation: ${operation}`);
        }
    }

    protected calculateCompareResult(values: Value[], operation: string): Value {
        const left = values[0];
        const right = values[1];

        switch (operation) {
            // = and == are equivalent
            case '=':
            case '==':
                return left.isLooselyEqualTo(right);
            case '!=':
                return left.isLooselyInequalTo(right);
            case '===':
                return left.isStrictlyEqualTo(right);
            case '!==':
                return left.isStrictlyInequalTo(right);
            case '<':
                return left.isLessThan(right);
            case '<=':
                return left.isLessThanOrEqualTo(right);
            case '>':
                return left.isGreaterThan(right);
            case '>=':
                return left.isGreaterThanOrEqualTo(right);
            default:
                throw new Error(`Unknown comparison operation: ${operation}`);
        }
    }

    protected calculateArithmeticAdditiveResult(values: Value[], operation: string): Value {
        const left = values[0];
        const right = values[1];

        switch (operation) {
            case '+':
                return left.add(right);
            case '-':
                return left.subtract(right);
            default:
                throw new Error(`Unknown arithmetic additive operation: ${operation}`);
        }
    }

    protected calculateArithmeticMultiplicativeResult(values: Value[], operation: string): Value {
        const left = values[0];
        const right = values[1];

        switch (operation) {
            case '*':
                return left.multiply(right);
            case '/':
                return left.divide(right);
            case '%':
                return left.modulo(right);
            default:
                throw new Error(`Unknown arithmetic multiplicative operation: ${operation}`);
        }
    }

    protected calculateExponentiationResult(values: Value[]): Value {
        const base = values[0];
        const exponent = values[1];

        return base.pow(exponent);
    }

    protected calculateBooleanNegationResult(values: Value[]): Value {
        const operand = values[0];
        return operand.not();
    }

    protected calculateKeywordOperatorResult(values: Value[], operation: string): Value {
        switch (operation) {
            case 'in':
                return values[1].contains(values[0]);
            case 'contains':
                return values[0].contains(values[1]);
            case 'like':
            case 'matches':
                return values[0].testGlob(values[1]);
            case 'irlike':
                return values[0].testRegex(values[1], true);
            case 'rlike':
            case 'regex':
                return values[0].testRegex(values[1]);
        }
        throw new Error(`Unrecognized keyword operator: ${operation}.`);
    }

    protected calculateArithmeticUnaryResult(values: Value[], operation: string): Value {
        const operand = values[0];

        switch (operation) {
            case '+':
                return operand;
            case '-':
                return operand.negate();
            default:
                throw new Error(`Unknown arithmetic unary operation: ${operation}`);
        }
    }

    protected calculateArrayIndexingResult(values: Value[]): Value {
        const array = values[0];
        const index = values[1];

        return array.getElementAt(index);
    }

    protected async calculateFunctionCallResult(context: EvaluationContext, func: string, values: Value[]): Promise<Value> {
        return await context.getFunction(func)(context, values);
    }

    protected calculateArrayDefinitionResult(values: Value[]): Value {
        return new Value(ValueDataType.Array, values);
    }
}