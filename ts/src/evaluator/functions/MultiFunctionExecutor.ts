import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IValue } from '../../model/value/IValue.js';
import { IFunctionExecutor } from './IFuctionExecutor.js';

export class MultiFunctionExecutor implements IFunctionExecutor {
    protected readonly executors: IFunctionExecutor[];

    public constructor(executors: IFunctionExecutor[]) {
        this.executors = executors;
    }

    public async executeFunction(functionName: string, context: IEvaluationContext, args: IValue[]): Promise<IValue> {
        for (const executor of this.executors) {
            try {
                return await executor.executeFunction(functionName, context, args);
            } catch (e) {
                // Ignore and try the next executor
            }
        }
        throw new Error(`Function ${functionName} is unknown or cannot be executed`);
    }
}