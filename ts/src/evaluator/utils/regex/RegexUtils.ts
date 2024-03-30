import { PcreParser } from './PcreParser.js';

/**
 * Utility class for PCRE regex compatibility
 */
export class RegexUtils {

    /**
     * Escapes regex special characters in a string according to PCRE rules
     * @param str PCRE-compliant regex string
     */
    public static escape(str: string): string {
        // TODO: Implement this
        return str;
    }

    /**
     * Converts a PCRE reges string into an ECMA regex object
     * @param str PCRE-compliant regex string
     * @param flags Default regex flags to use if none are provided
     */
    public static toEcmaRegex(str: string, flags: Partial<RegexFlags>): RegExp {
        const defaultFlags: RegexFlags = {
            d: false,
            g: false,
            i: false,
            m: false,
            s: false,
            u: true,
            v: false,
            y: false
        };
        const effectiveFlags: RegexFlags = Object.assign(defaultFlags, flags);

        const parser = new PcreParser(str);
        const rootGroup = parser.parse();

        // Extract flags from the root group to apply them to the RegExp object
        for (const option of rootGroup.options) {
            const optionValue = option.startsWith('-') ? false : true;
            const optionName = option.replace(/^-/, '').toLowerCase();

            if (optionName in effectiveFlags) {
                effectiveFlags[optionName as keyof RegexFlags] = optionValue;
            }
        }
        // We don't need the options on the root group so clear them
        rootGroup.options.slice(0, rootGroup.options.length);

        let flagString = '';
        for (const [key, value] of Object.entries(effectiveFlags)) {
            if (value) {
                flagString += key;
            }
        }

        const ecmaRegexString = rootGroup.toEcmaRegexString();
        console.log('`' + ecmaRegexString + '`');
        console.log(flagString);
        return new RegExp(ecmaRegexString, flagString);
    }
}

type RegexFlags = {
    d: boolean;
    g: boolean;
    i: boolean;
    m: boolean;
    s: boolean;
    u: boolean;
    v: boolean;
    y: boolean;
};