import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IValue } from '../../model/value/IValue.js';
import { AbuseFilterFunctions } from './AbuseFilterFunctions.js';
import { IFunctionExecutor } from './IFuctionExecutor.js';

/**
 * Function executor that looks a function up in the local function registry
 * and executes it.
 * 
 * Uses functions defined in the AbuseFilterFunctions class.
 */
export class LocalFunctionExecutor implements IFunctionExecutor {

    public async executeFunction(functionName: string, context: IEvaluationContext, args: IValue[]): Promise<IValue> {
        const func = AbuseFilterFunctions.getFunction(functionName);
        if (func === undefined) {
            throw new Error(`Function ${functionName} is unknown or cannot be executed locally`);
        }

        return func(context, args);
    }
}