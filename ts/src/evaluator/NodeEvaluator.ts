import { TreeNodeType } from '../model/TreeNodeType.js';
import { EvaluatedTreeNode } from './EvaluatedTreeNode.js';
import { EvaluationContext } from './EvaluationContext.js';
import { Value } from './Value.js';
import { ValueDataType } from '../model/ValueDataType.js';
import { VariableValue } from './VariableValue.js';

export class NodeEvaluator {

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
        const nodeType = treeNode.node.type;
        const tokenValue = treeNode.node.identity.value;
        if (nodeType == TreeNodeType.Operator && ['?', 'if'].includes(tokenValue)) {
            return this.evaluateConditionalOperatorLazily(treeNode.children, context);
        }

        // This is a greedy evaluation so we can calculate all the children first
        // and then the parent value. The order of evaluation is important (eg. because of variables)
        // but all nodes will use the same context, as there's no speculative execution here.
        for (const child of treeNode.children) {
            await child.evaluate(context, this);
        }

        const values = treeNode.children.map((child) => child.value);

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
        if (treeNode.node.identity.value == '&') {
            return this.evaluateLogicalOperatorLazily(treeNode.children, context, true);
        } else if (treeNode.node.identity.value == '|') {
            return this.evaluateLogicalOperatorLazily(treeNode.children, context, false);
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

    protected calculateOperatorNodeResult(operator: string, values: Value[]): Value {
        const left = values[0];
        const right = values[1];

        switch (operator) {
            case ';':
                return values[values.length - 1];
            case '&':
                return Value.and(values);
            case '|':
                return Value.or(values);
            case '^':
                return Value.xor(values);
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
            case '+':
                // Plus can be unary or binary
                return (right !== undefined) ? left.add(right) : left;
            case '-':
                // Minus can be unary or binary
                return (right !== undefined) ? left.subtract(right) : left.negate();
            case '*':
                return left.multiply(right);
            case '/':
                return left.divide(right);
            case '%':
                return left.modulo(right);
            case '**':
                return left.pow(right);
            case '!':
                return left.not();
            case 'in':
                return right.contains(left);
            case 'contains':
                return left.contains(right);
            case 'like':
            case 'matches':
                return left.testGlob(right);
            case 'irlike':
                return left.testRegex(right, true);
            case 'rlike':
            case 'regex':
                return left.testRegex(right);
        }

        // If we got here, the operator is unknown
        throw new Error(`Unrecognized operator: ${operator}`);
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
        const newValue = values[1];
        if (values.length == 2) {
            array.appendElement(newValue);
        } else {
            const index = values[2];
            array.setElementAt(index, newValue);
        }
        return newValue;
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