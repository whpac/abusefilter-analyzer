import { IFunctionExecutor } from '../src/evaluator/functions/IFuctionExecutor.js';
import { Value } from '../src/evaluator/value/Value.js';
import { IEvaluationContext } from '../src/model/IEvaluationContext.js';
import { IValue } from '../src/model/value/IValue.js';

export class FunctionExecutorTestExtensions implements IFunctionExecutor {

    public executeFunction(functionName: string, context: IEvaluationContext, args: IValue<unknown>[]): Promise<IValue<unknown>> {
        if (functionName === 'x_isundef') {
            return FunctionExecutorTestExtensions.isUndefined(context, args);
        }
        throw new Error(`Function ${functionName} is unknown or cannot be executed`);
    }

    private static async isUndefined(context: IEvaluationContext, args: IValue[]): Promise<Value<boolean>> {
        if (args.length !== 1) {
            throw new Error('x_isundef function expects exactly one argument');
        }

        const value = args[0];
        return value.isUndefined ? Value.True : Value.False;
    }
}