import { PcreGroup, PcreParser } from './PcreParser.js';

/**
 * Utility class for PCRE regex compatibility
 */
export class RegexUtils {

    /**
     * Escapes regex special characters in a string according to ECMA regex rules
     * @param str PCRE-compliant regex string
     */
    public static escape(str: string): string {
        // We can't parse this string as regex and then add backslash to
        // special characters because the input string is likely not to
        // be a well-formed regex.
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Parses a PCRE regex string into an object
     * @param str PCRE-compliant regex string
     */
    public static parse(str: string): PcreGroup {
        const parser = new PcreParser(str);
        return parser.parse();
    }

    /**
     * Converts a PCRE reges string into an ECMA regex object
     * @param str PCRE-compliant regex string
     * @param flags Default regex flags to use if none are provided
     */
    public static toEcmaRegex(regex: string | PcreGroup, flags: Partial<RegexFlags>): RegExp {
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

        const rootGroup = typeof regex === 'string' ? this.parse(regex) : regex;

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