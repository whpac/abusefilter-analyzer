import { EvaluationContext } from './EvaluationContext.js';
import { Value } from './Value.js';
import { ValueDataType } from './ValueDataType.js';
import { IPUtils } from './utils/IPUtils.js';
import { RegexUtils } from './utils/regex/RegexUtils.js';

export class AbuseFilterFunctions {

    /** A map of all AbuseFilter functions */
    private static readonly functions: Map<string, AbuseFilterFunction<unknown>> = new Map([
        ['lcase', AbuseFilterFunctions.lcase],
        ['ucase', AbuseFilterFunctions.ucase],
        ['length', AbuseFilterFunctions.lengthFunc],
        ['string', AbuseFilterFunctions.string],
        ['int', AbuseFilterFunctions.int],
        ['float', AbuseFilterFunctions.float],
        ['bool', AbuseFilterFunctions.bool],
        ['norm', AbuseFilterFunctions.norm],
        ['ccnorm', AbuseFilterFunctions.ccnorm],
        ['ccnorm_contains_any', AbuseFilterFunctions.ccnorm_contains_any],
        ['ccnorm_contains_all', AbuseFilterFunctions.ccnorm_contains_all],
        ['specialratio', AbuseFilterFunctions.specialratio],
        ['rmspecials', AbuseFilterFunctions.rmspecials],
        ['rmdoubles', AbuseFilterFunctions.rmdoubles],
        ['rmwhitespace', AbuseFilterFunctions.rmwhitespace],
        ['count', AbuseFilterFunctions.count],
        ['rcount', AbuseFilterFunctions.rcount],
        ['get_matches', AbuseFilterFunctions.get_matches],
        ['ip_in_range', AbuseFilterFunctions.ip_in_range],
        ['ip_in_ranges', AbuseFilterFunctions.ip_in_ranges],
        ['contains_any', AbuseFilterFunctions.contains_any],
        ['contains_all', AbuseFilterFunctions.contains_all],
        ['equals_to_any', AbuseFilterFunctions.equals_to_any],
        ['substr', AbuseFilterFunctions.substr],
        ['strlen', AbuseFilterFunctions.lengthFunc],
        ['strpos', AbuseFilterFunctions.strpos],
        ['str_replace', AbuseFilterFunctions.str_replace],
        ['str_replace_regexp', AbuseFilterFunctions.str_replace_regexp],
        ['rescape', AbuseFilterFunctions.rescape],
        ['set', AbuseFilterFunctions.set],
        ['set_var', AbuseFilterFunctions.set],
        ['sanitize', AbuseFilterFunctions.sanitize],
    ]);

    /** Returns a function by its name */
    public static getFunction(name: string): AbuseFilterFunction<unknown> | undefined {
        return AbuseFilterFunctions.functions.get(name);
    }

    /** Converts the input text to the lowercase */
    public static async lcase(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'lcase');
        return new Value(ValueDataType.String, args[0].toString().toLowerCase());
    }

    /** Converts the input text to the uppercase */
    public static async ucase(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'ucase');
        return new Value(ValueDataType.String, args[0].toString().toUpperCase());
    }

    /** Returns the length of the input text or number of elements in an array */
    public static async lengthFunc(context: EvaluationContext, args: Value[]): Promise<Value<number>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'length');
        const input = args[0];
        if (input.dataType === ValueDataType.Array) {
            return new Value(ValueDataType.Integer, input.toArray().length);
        }
        return new Value(ValueDataType.Integer, input.toString().length);
    }

    /** Converts the input to a string */
    public static async string(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'string');
        return new Value(ValueDataType.String, args[0].toString());
    }

    /** Converts the input to an integer */
    public static async int(context: EvaluationContext, args: Value[]): Promise<Value<number>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'int');
        return new Value(ValueDataType.Integer, Math.floor(args[0].toNumber()));
    }

    /** Converts the input to a float */
    public static async float(context: EvaluationContext, args: Value[]): Promise<Value<number>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'float');
        return new Value(ValueDataType.Float, args[0].toNumber());
    }

    /** Converts the input to a boolean */
    public static async bool(context: EvaluationContext, args: Value[]): Promise<Value<boolean>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'bool');
        return args[0].asBoolean();
    }

    /** Normalizes the input string using multiple AbuseFilter functions */
    public static async norm(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'norm');
        throw new Error('Not implemented');
        // TODO: requires ccnorm
    }

    /** Normalizes the input string, replacing confusible characters by a class representant */
    public static async ccnorm(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'ccnorm');
        throw new Error('Not implemented');
        // TODO: requires ccnorm
    }

    /** Checks if the first string contains any of the subsequent ones. All arguments are cc-normalized */
    public static async ccnorm_contains_any(context: EvaluationContext, args: Value[]): Promise<Value<boolean>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'ccnorm_contains_any');
        throw new Error('Not implemented');
        // TODO: requires ccnorm
    }

    /** Checks if the first string contains all of the subsequent ones. All arguments are cc-normalized */
    public static async ccnorm_contains_all(context: EvaluationContext, args: Value[]): Promise<Value<boolean>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'ccnorm_contains_all');
        throw new Error('Not implemented');
        // TODO: requires ccnorm
    }

    /** Returns the number of non-alphanumeric characters divided by the total number of characters in the argument */
    public static async specialratio(context: EvaluationContext, args: Value[]): Promise<Value<number>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'specialratio');
        const input = args[0].toString();
        if (input.length === 0) {
            return new Value(ValueDataType.Float, 0);
        }

        const inputNoSpecials = AbuseFilterFunctions.removeSpecialCharacters(input);
        return new Value(ValueDataType.Float, 1 - (inputNoSpecials.length / input.length));
    }

    /** Removes all non-alphanumeric characters from the input */
    public static async rmspecials(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'rmspecials');
        return new Value(ValueDataType.String, AbuseFilterFunctions.removeSpecialCharacters(args[0].toString()));
    }

    /** Removes repeating characters from the input */
    public static async rmdoubles(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'rmdoubles');
        return new Value(ValueDataType.String, AbuseFilterFunctions.removeRepeatingCharacters(args[0].toString()));
    }

    /** Removes whitespace characters from the input */
    public static async rmwhitespace(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'rmwhitespace');
        return new Value(ValueDataType.String, AbuseFilterFunctions.removeWhitespaces(args[0].toString()));
    }

    /**
     * Returns the number of occurrences of the second string in the first one.
     * If a single argument is given, it's split by commas and the number of elements is returned
     */
    public static async count(context: EvaluationContext, args: Value[]): Promise<Value<number>> {
        AbuseFilterFunctions.assertArgumentCount(args, [1, 2], 'count');

        const needle = args[0].toString();
        if (args.length === 1) {
            if (args[0].dataType === ValueDataType.Array) {
                return new Value(ValueDataType.Integer, args[0].toArray().length);
            }

            return new Value(ValueDataType.Integer, needle.split(',').length);
        }

        if (needle.length === 0) {
            return new Value(ValueDataType.Integer, 0);
        }

        const haystack = args[1].toString();
        let count = 0;
        let index = 0;
        while ((index = haystack.indexOf(needle, index)) !== -1) {
            index += needle.length; // So that "aa" is contained once in "aaa"
            count++;
        }
        return new Value(ValueDataType.Integer, count);
    }

    /**
     * Returns the number of occurrences of the pattern in the first string.
     * If a single argument is given, it's split by commas and the number of elements is returned
     */
    public static async rcount(context: EvaluationContext, args: Value[]): Promise<Value<number>> {
        AbuseFilterFunctions.assertArgumentCount(args, [1, 2], 'rcount');

        const input = args[0].toString();
        if (args.length === 1) {
            return new Value(ValueDataType.Integer, input.split(',').length);
        }

        const pattern = args[1].toString();
        const regex = RegexUtils.toEcmaRegex(pattern, { g: true, u: true });
        const matches = input.match(regex);
        return new Value(ValueDataType.Integer, matches?.length ?? 0);
    }

    /**
     * Returns an array of all matches of the pattern in the input string.
     * If the pattern is not found, an empty array is returned.
     */
    public static async get_matches(context: EvaluationContext, args: Value[]): Promise<Value<Value[]>> {
        AbuseFilterFunctions.assertArgumentCount(args, 2, 'get_matches');

        const input = args[0].toString();
        const pattern = args[1].toString();
        const regex = RegexUtils.toEcmaRegex(pattern, { g: true, u: true });
        const matches = input.match(regex);

        // Now we need to convert the array of strings to an array of Values
        // However, if a group did not match, it will be `undefined` in the array and we replace it into false
        const matchesValues = matches?.map(m =>
            m !== undefined ? new Value(ValueDataType.String, m) : Value.False
        ) ?? [ Value.False ];
        return new Value(ValueDataType.Array, matchesValues);
    }

    /** Checks if the IP address is in the specified range */
    public static async ip_in_range(context: EvaluationContext, args: Value[]): Promise<Value<boolean>> {
        AbuseFilterFunctions.assertArgumentCount(args, 2, 'ip_in_range');
        return AbuseFilterFunctions.ip_in_ranges(context, args);
    }

    /** Checks if the IP address is in any of the specified ranges */
    public static async ip_in_ranges(context: EvaluationContext, args: Value[]): Promise<Value<boolean>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'ip_in_ranges');

        // We want to silence errors from mismatched IP versions being compared
        // and treat such a case as an ordinary "not in range"
        const ip = args[0].toString();
        for (let i = 1; i < args.length; i++) {
            try {
                const range = args[i].toString();
                if (IPUtils.isInRange(ip, range)) {
                    return Value.True;
                }
            } catch (e) {
                // Ignore, go to the next range
            }
        }
        return Value.False;
    }

    /** Checks if the first string contains any of the subsequent ones */
    public static async contains_any(context: EvaluationContext, args: Value[]): Promise<Value<boolean>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'contains_any');
        const input = args[0];
        for (let i = 1; i < args.length; i++) {
            if (input.contains(args[i]).isTruthy()) {
                return Value.True;
            }
        }
        return Value.False;
    }

    /** Checks if the first string contains all of the subsequent ones */
    public static async contains_all(context: EvaluationContext, args: Value[]): Promise<Value<boolean>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'contains_all');
        const input = args[0];
        for (let i = 1; i < args.length; i++) {
            if (!input.contains(args[i]).isTruthy()) {
                return Value.False;
            }
        }
        return Value.True;
    }

    /** Checks if the first element is equal to any of the subsequent ones */
    public static async equals_to_any(context: EvaluationContext, args: Value[]): Promise<Value<boolean>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'equals_to_any');
        const input = args[0];
        for (let i = 1; i < args.length; i++) {
            if (input.isStrictlyEqualTo(args[i]).isTruthy()) {
                return Value.True;
            }
        }
        return Value.False;
    }

    /** Returns a substring of the input string */
    public static async substr(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, 3], 'substr');
        const input = args[0].toString();
        const start = args[1].toNumber();

        if (args.length === 2) {
            return new Value(ValueDataType.String, input.substring(start));
        } else {
            const length = args[2].toNumber();
            const end = Math.min(start + length, input.length);
            return new Value(ValueDataType.String, input.substring(start, end));
        }
    }

    /** Returns the position of the first occurrence of the pattern in the input string */
    public static async strpos(context: EvaluationContext, args: Value[]): Promise<Value<number>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, 3], 'strpos');
        const input = args[0].toString();
        const pattern = args[1].toString();
        let offset = 0;
        if (args.length === 3) {
            offset = args[2].toNumber();
        }

        if (pattern.length === 0) {
            return new Value(ValueDataType.Integer, -1);
        }
        if (offset >= input.length) {
            return new Value(ValueDataType.Integer, -1);
        }

        const index = input.indexOf(pattern, offset);
        return new Value(ValueDataType.Integer, index);
    }

    /** Replaces all occurrences of the pattern in the input string with the replacement */
    public static async str_replace(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, 3, 'str_replace');
        const input = args[0].toString();
        const pattern = args[1].toString();
        const replacement = args[2].toString();
        return new Value(ValueDataType.String, input.replaceAll(pattern, replacement));
    }

    /** Replaces all occurrences of the regex pattern in the input string with the replacement */
    public static async str_replace_regexp(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, 3, 'str_replace_regexp');
        const input = args[0].toString();
        const pattern = args[1].toString();
        const replacement = args[2].toString();
        const regex = RegexUtils.toEcmaRegex(pattern, { g: true, u: true });
        return new Value(ValueDataType.String, input.replace(regex, replacement));
    }

    /** Escapes the special characters in the input string */
    public static async rescape(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'rescape');
        return new Value(ValueDataType.String, args[0].toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        // TODO: extract into regex utils
    }

    /** Sets the variable in the context */
    public static async set(context: EvaluationContext, args: Value[]): Promise<Value> {
        AbuseFilterFunctions.assertArgumentCount(args, 2, 'set');
        const variableName = args[0].toString();
        const value = args[1];
        context.setVariable(variableName, value);
        return value;
    }

    /** Sanitizes the input string */
    public static async sanitize(context: EvaluationContext, args: Value[]): Promise<Value<string>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'sanitize');

        const input = args[0].toString();

        // Replicate PHP html_entity_decode() behavior
        const sanitized = input.replace(/&(#\d+|#x[0-9a-f]+|quot|amp|lt|gt);/gi, function(match, charCodeRaw) {
            switch (charCodeRaw) {
                case 'quot': return '"';
                case 'amp': return '&';
                case 'lt': return '<';
                case 'gt': return '>';
            }

            let charCode;
            if (charCodeRaw.startsWith('#x')) {
                charCode = parseInt(charCodeRaw.slice(2), 16);
            } else {
                charCode = parseInt(charCodeRaw.slice(1), 10);
            }
            return String.fromCharCode(charCode);
        });
        
        return new Value(ValueDataType.String, sanitized);
    }

    //! Utility functions for other functions
    private static removeSpecialCharacters(s: string) {
        return s.replace(/[^\p{L}\p{N}\s]/ug, '');
    }

    private static removeRepeatingCharacters(s: string) {
        return s.replace(/(.)\1+/ug, '$1');
    }

    private static removeWhitespaces(s: string) {
        return s.replace(/\s+/ug, '');
    }

    //! Utility functions for checking the argument count
    /**
     * Ensures that the provided number of arguments matches the expected count.
     * @param args The arguments actually provided
     * @param expectedCount An expected number of arguments, either a single number or a range [min, max]
     * @param functionName The function name, used for error messages
     */
    private static assertArgumentCount(args: Value[], expectedCount: number | [number, number], functionName: string): void {
        const providedCount = args.length;
        if (typeof expectedCount === 'number') {
            expectedCount = [expectedCount, expectedCount];
        }

        if (providedCount < expectedCount[0] || providedCount > expectedCount[1]) {
            throw new Error(`Function ${functionName} expects ${expectedCount[0]} to ${expectedCount[1]} arguments, but got ${providedCount}`);
        }
    }
}

export type AbuseFilterFunction<T> = (context: EvaluationContext, args: Value[]) => Promise<Value<T>>;
