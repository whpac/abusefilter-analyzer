import * as fs from 'fs';
import { CCNormProvider } from '../src/evaluator/functions/CCNormProvider.js';

export class CCNormFileProvider extends CCNormProvider {

    protected async loadConversionTable(path: string): Promise<Map<string, string>> {
        return new Promise<Map<string, string>>((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    return reject(new Error(`Failed to read conversion table from ${path}: ${err.message}`));
                }

                try {
                    const conversionTable = JSON.parse(data.toString()); // Ensure the file is valid JSON
                    if (typeof conversionTable !== 'object' || conversionTable === null) {
                        return reject(new Error(`Invalid conversion table format in ${path}`));
                    }

                    const map = new Map<string, string>(
                        Object.entries(conversionTable)
                    );
                    return resolve(map);
                } catch (parseError) {
                    return reject(new Error(`Failed to parse conversion table: ${parseError}`));
                }
            });
        });
    }
}