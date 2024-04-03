import * as path from 'path';
import * as fs from 'fs';
import { assert } from 'chai';
import { AbuseFilter } from '../src/AbuseFilter.js';

describe('Expressions from .t files', () => {
    // Read files with .t extension from the /parserTests folder
    // And treat the content of every file as an expression that should be truthy

    const testFolder = 'parserTests';

    fs.readdirSync(testFolder).forEach((file: string) => {
        if (path.extname(file) === '.t') {
            it(file, async () => {
                try {
                    const content = fs.readFileSync(path.join(testFolder, file), 'utf8');
                    const filter = new AbuseFilter(content);
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