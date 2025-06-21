import * as path from 'path';
import * as fs from 'fs';
import { assert } from 'chai';
import { AbuseFilter } from '../src/AbuseFilter.js';
import { MultiFunctionExecutor } from './MultiFunctionExecutor.js';
import { LocalFunctionExecutor } from '../src/evaluator/functions/LocalFunctionExecutor.js';
import { FunctionExecutorTestExtensions } from './FunctionExecutorTestExtensions.js';
import { AbuseFilterFunctions } from '../src/evaluator/functions/AbuseFilterFunctions.js';
import { CCNormFileProvider } from './CCNormFileProvider.js';

describe('Expressions from .t files', () => {
    // Read files with .t extension from the upstream/parserTests folder
    // And treat the content of every file as an expression that should be truthy

    const testFolders = [
        'upstream/parserTests',
        'upstream/parserTestsEquivset',
    ];

    // In theory, we could load the equivset.json from URL, but reading file is faster
    AbuseFilterFunctions.ccnormProvider = new CCNormFileProvider('upstream/equivset.json');

    const functionExecutorTestExtensions = new FunctionExecutorTestExtensions();
    const localFunctionExecutor = new LocalFunctionExecutor();
    const functionExecutor = new MultiFunctionExecutor(
        [ functionExecutorTestExtensions, localFunctionExecutor ]
    );

    for (const testFolder of testFolders) {
        describe(testFolder, () => {
            fs.readdirSync(testFolder).forEach((file: string) => {
                if (path.extname(file) === '.t') {
                    it(file, async () => {
                        try {
                            const content = fs.readFileSync(path.join(testFolder, file), 'utf8');
                            const filter = new AbuseFilter(content);
                            filter.functionExecutor = functionExecutor;
                            const value = await filter.evaluate();
        
                            assert.isTrue(value.isTruthy());
                        } catch(e) {
                            console.error((e as Error).toString());
                            throw e;
                        }
                    });
                }
            });
        });
    }
});