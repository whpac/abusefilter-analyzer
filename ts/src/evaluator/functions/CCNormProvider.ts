/**
 * This class provides a way to normalize visually-confusible characters, based on
 * a conversion table fetched from a specified URL.
 * The conversion table maps characters to their normalized forms.
 */
export class CCNormProvider {
    private ccnormUrl: string;
    private conversionTable: Map<string, string> | undefined;

    /**
     * Creates an instance of CCNormProvider.
     * @param ccnormUrl The URL to the conversion table JSON file.
     */
    public constructor(ccnormUrl: string) {
        this.ccnormUrl = ccnormUrl;
    }

    /**
     * Initializes the conversion table if it has not been loaded yet.
     * This method fetches the conversion table from the specified URL and stores it.
     */
    public async initializeIfNeeded(): Promise<void> {
        if (this.conversionTable !== undefined) {
            return; // Already initialized
        }

        this.conversionTable = await this.loadConversionTable(this.ccnormUrl);
    }

    protected async loadConversionTable(url: string): Promise<Map<string, string>> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch conversion table from ${url}: ${response.statusText}`);
        }

        const data = await response.json();
        if (typeof data !== 'object' || data === null) {
            throw new Error(`Invalid conversion table format in ${url}`);
        }
        return new Map<string, string>(Object.entries(data));
    }

    /**
     * Normalizes the input string by replacing visually-confusible characters
     * with their normalized forms based on the conversion table.
     * @param input The input string to normalize.
     * @returns The normalized string.
     */
    public ccnorm(input: string): string {
        if (this.conversionTable === undefined) {
            throw new Error('CCNormProvider is not initialized. Call initializeIfNeeded() first.');
        }

        let output = '';
        for (const char of input) {
            const normalizedChar = this.conversionTable.get(char);
            if (normalizedChar !== undefined) {
                output += normalizedChar;
            } else {
                output += char; // Keep the original character if no conversion is found
            }
        }
        
        return output;
    }
}
