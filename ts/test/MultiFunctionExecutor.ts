import { IEvaluationContext } from '../src/model/IEvaluationContext.js';
import { IValue } from '../src/model/value/IValue.js';
import { IFunctionExecutor } from '../src/evaluator/functions/IFuctionExecutor.js';

/**
 * A compound function executor that tries to execute a function using a list of executors.
 * The first executor that can execute the function is used. Executors are tried in the order
 * they are provided in the constructor. If no executor can execute the function, an error
 * is thrown.
 */
export class MultiFunctionExecutor implements IFunctionExecutor {
    protected readonly executors: IFunctionExecutor[];

    public constructor(executors: IFunctionExecutor[]) {
        this.executors = executors;
    }

    public async executeFunction(functionName: string, context: IEvaluationContext, args: IValue[]): Promise<IValue> {
        const errors = [];
        for (const executor of this.executors) {
            try {
                return await executor.executeFunction(functionName, context, args);
            } catch (e) {
                // Try the next executor
                errors.push(e);
            }
        }
        throw new Error(`Function ${functionName} is unknown or cannot be executed: ${errors.map(e => '' + e).join(', ')}`);
    }
}