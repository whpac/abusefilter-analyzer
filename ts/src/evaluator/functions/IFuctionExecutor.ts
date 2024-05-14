import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IValue } from '../../model/value/IValue.js';

export interface IFunctionExecutor {

    /**
     * Executes a function by its name. If the function is unsupported by this executor,
     * throws an error.
     * @param functionName Name of the function to execute
     * @param context The evaluation context to execute the function in
     * @param args Arguments to pass to the function
     */
    executeFunction(functionName: string, context: IEvaluationContext, args: IValue[]): Promise<IValue>;
}