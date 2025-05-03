import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IValue } from '../../model/value/IValue.js';
import { Value } from '../value/Value.js';
import { IFunctionExecutor } from './IFuctionExecutor.js';

/**
 * Function executor that delegates the execution to the API.
 * Please note that by default only priviledged users can use that
 * API endpoint.
 * 
 * In order to reduce server strain, the calls are cached: all results
 * are kept in memory and as many as possible are saved to the session
 * storage.
 */
export class RemoteFunctionExecutor implements IFunctionExecutor {
    /** Key under which to store the data in session storage */
    private readonly STORAGE_KEY = 'abusefilter-eval-cache';
    /** An approximate size limit for the function result cache, in bytes */
    private readonly STORAGE_SIZE_LIMIT = 3 * 1024 * 1024; // 3MB

    private cache: Map<string, IValue<unknown>> = new Map<string, IValue<unknown>>();

    public constructor() {
        // Load the cache from session storage if available
        const cacheString = sessionStorage.getItem(this.STORAGE_KEY);
        if (cacheString) {
            try {
                const cacheObject = JSON.parse(cacheString) as Record<string, unknown>;
                for (const key in cacheObject) {
                    this.cache.set(key, Value.fromNative(cacheObject[key]));
                }
            } catch (e) {
                console.error('Failed to load cache from session storage', e);
            }
        }
    }

    public async executeFunction(functionName: string, context: IEvaluationContext, args: IValue<unknown>[]): Promise<IValue<unknown>> {    
        // 'Undefined' does not exist in the API, so we need to handle it separately here
        if (args.some(arg => arg.isUndefined)) {
            return Value.Undefined;
        }
        
        const functionExpression = `${functionName}(${args.map(arg => arg.toLiteral()).join(', ')})`;

        if (this.cache.has(functionExpression)) {
            return this.cache.get(functionExpression)!;
        }
        
        const apiParams = new FormData();
        apiParams.set('action', 'abusefilterevalexpression');
        apiParams.set('format', 'json');
        apiParams.set('expression', functionExpression);
        
        const apiUrl = '/w/api.php';
        const response = await fetch(
            apiUrl,
            {
                method: 'POST',
                headers: new Headers({
                    'Api-User-Agent': 'abusefilter-analyzer (User:Msz2001)',
                }),
                body: apiParams
            }
        );

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

        const reifiedValue = Value.fromNative(value);
        this.cache.set(functionExpression, reifiedValue);
        this.scheduleSessionCacheUpdate();
        return reifiedValue;
    }

    private cacheUpdateTimeout: number | null = null;
    private scheduleSessionCacheUpdate(): void {
        // Do the updates at most every 5 seconds
        // The evaluations are going to be every few milliseconds, so we could save
        // some processing and update the cache every now and then
        if (this.cacheUpdateTimeout !== null) {
            return;
        }
        this.cacheUpdateTimeout = window.setTimeout(() => {
            this.updateSessionCache();
            this.cacheUpdateTimeout = null;
        }, 5000);
    }

    private updateSessionCache(): void {
        // First, sort the cache entries by the size: the smallest ones first
        // This is to avoid as many requests to API as possible, given that
        // the session storage is limited to 5MB.
        // We compare by the key size, as it's always a string, and in practice
        // it's usually of a similar size to the value size (ccnorm family).
        const sortedCache = Array.from(this.cache.entries()).sort((a, b) => {
            const aSize = a[0].length;
            const bSize = b[0].length;
            return aSize - bSize;
        });

        let currentSize = 0; // in bytes
        const cacheObject: Record<string, unknown> = {};
        for (const [key, value] of sortedCache) {
            // The key length is multiplied by 4 for two reasons:
            //    - JS strings are UTF-16 encoded, so every char is 2 bytes
            //    - we assume that keys and values have similar size, so double again
            // We also assume that the JSON.stringify will not increase the size too much
            currentSize += key.length * 4;

            if (currentSize > this.STORAGE_SIZE_LIMIT) {
                // We reached the limit, stop adding new entries
                break;
            }

            cacheObject[key] = value.value;
        }

        // Save the cache to session storage
        // We still need to catch any errors, eg. from other big values in the session storage
        try {
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheObject));
        } catch(e) {
            console.error('Failed to save cache to session storage', e);
        }
    }
}

type AbuseFilterEvalResponse = {
    abusefilterevalexpression: {
        result: unknown;
    },
    error?: {
        code: string;
        info: string;
    }
}