import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IValue } from '../../model/value/IValue.js';
import { IFunctionExecutor } from './IFuctionExecutor.js';

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