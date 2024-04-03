import { TreeNodeType } from '../model/TreeNodeType.js';
import { EvaluationContext } from './EvaluationContext.js';
import { Value } from './Value.js';
import { ValueDataType } from '../model/ValueDataType.js';
import { VariableValue } from './VariableValue.js';
import { IEvaluableTreeNode } from '../model/IEvaluableTreeNode.js';
import { TokenType } from '../model/TokenType.js';

export class NodeEvaluator {

    /**
     * Evaluates the node and all its children if needed.
     * @param treeNode The tree node to be evaluated
     * @param evaluationContext The context of evaluation, containing all the variables and functions
     */
    public async evaluateNode(treeNode: IEvaluableTreeNode, evaluationContext: EvaluationContext): Promise<Value> {
        let value;

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

        treeNode.setValue(evaluationContext, value);
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
    protected async evaluateNodeLazily(treeNode: IEvaluableTreeNode, context: EvaluationContext): Promise<Value> {
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
    protected async evaluateNodeGreedily(treeNode: IEvaluableTreeNode, context: EvaluationContext): Promise<Value> {
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
    protected async evaluateLogicalOperatorLazily(operands: readonly IEvaluableTreeNode[], context: EvaluationContext, neutralElement: boolean): Promise<Value> {
        return new Promise((resolve, reject) => {
            const lastOperand = operands[operands.length - 1];

            let wasResolved = false;
            let lastIterationPromise = Promise.resolve();
            for (const operand of operands) {
                lastIterationPromise = lastIterationPromise.then(() => 
                    this.evaluateNode(operand, context).then((value) => {
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

    protected async evaluateConditionalOperatorLazily(operands: readonly IEvaluableTreeNode[], context: EvaluationContext): Promise<Value> {
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