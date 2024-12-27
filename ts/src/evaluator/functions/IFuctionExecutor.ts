import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IValue } from '../../model/value/IValue.js';

/**
 * Interface for a function executor. It is responsible for dispatching function calls to the
 * appropriate function implementation. The actual function execution can happen either locally
 * or at a remote machine, for instance a MediaWiki server.
 */
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