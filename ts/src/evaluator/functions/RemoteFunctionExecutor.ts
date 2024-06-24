import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IValue } from '../../model/value/IValue.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { Value } from '../value/Value.js';
import { IFunctionExecutor } from './IFuctionExecutor.js';

/**
 * Function executor that delegates the execution to the API.
 * Please note that by default only priviledged users can use that
 * API endpoint.
 */
export class RemoteFunctionExecutor implements IFunctionExecutor {

    public async executeFunction(functionName: string, context: IEvaluationContext, args: IValue<unknown>[]): Promise<IValue<unknown>> {
        const apiUrl = '/w/api.php?action=abusefilterevalexpression&format=json&expression=';
        const functionExpression = `${functionName}(${args.map(arg => arg.toLiteral()).join(', ')})`;
        const response = await fetch(apiUrl + encodeURIComponent(functionExpression));

        let result: AbuseFilterEvalResponse;
        try {
            result = await response.json() as AbuseFilterEvalResponse;
        } catch(e) {
            throw new Error('Server response is not a valid JSON object');
        }

        if (result.error) {
            throw new Error('Server error: ' + result.error.info);
        }

        const value = result.abusefilterevalexpression.result;

        if (value === 'null') {
            return new Value(ValueDataType.Null, null);
        } else if (value === 'true' || value === 'false') {
            return new Value(ValueDataType.Boolean, value === 'true');
        } else if (!isNaN(parseInt(value))) {
            return new Value(ValueDataType.Integer, parseInt(value));
        } else if (!isNaN(parseFloat(value))) {
            return new Value(ValueDataType.Float, parseFloat(value));
        }
        return new Value(ValueDataType.String, value);
    }
}

type AbuseFilterEvalResponse = {
    abusefilterevalexpression: {
        result: string;
    },
    error?: {
        code: string;
        info: string;
    }
}