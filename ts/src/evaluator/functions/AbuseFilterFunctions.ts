import { Value } from '../value/Value.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { IPUtils } from '../utils/IPUtils.js';
import { RegexUtils } from '../utils/regex/RegexUtils.js';
import { IEvaluationContext } from '../../model/IEvaluationContext.js';
import { IValue } from '../../model/value/IValue.js';
import { ValueStringOperations } from '../value/ValueStringOperations.js';
import { ValueComparer } from '../value/ValueComparer.js';
import { CCNormProvider } from './CCNormProvider.js';

/**
 * A collection of the functions available in the AbuseFilter upstream.
 */
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

    public static ccnormProvider: CCNormProvider | undefined;

    /** Returns a function by its name */
    public static getFunction(name: string): AbuseFilterFunction<unknown> | undefined {
        return AbuseFilterFunctions.functions.get(name);
    }

    /** Converts the input text to the lowercase */
    public static async lcase(context: IEvaluationContext, args: IValue[]): Promise<Value<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'lcase');
        if (args[0].isUndefined) return Value.Undefined;

        return new Value(ValueDataType.String, args[0].asString().value!.toLowerCase());
    }

    /** Converts the input text to the uppercase */
    public static async ucase(context: IEvaluationContext, args: IValue[]): Promise<Value<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'ucase');
        if (args[0].isUndefined) return Value.Undefined;

        return new Value(ValueDataType.String, args[0].asString().value!.toUpperCase());
    }

    /** Returns the length of the input text or number of elements in an array */
    public static async lengthFunc(context: IEvaluationContext, args: IValue[]): Promise<Value<number | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'length');
        const input = args[0];
        if (input.isUndefined) return Value.Undefined;

        if (input.dataType === ValueDataType.Array) {
            return new Value(ValueDataType.Integer, (input as IValue<unknown[]>).value.length);
        }
        return new Value(ValueDataType.Integer, input.asString().value!.length);
    }

    /** Converts the input to a string */
    public static async string(context: IEvaluationContext, args: IValue[]): Promise<IValue<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'string');
        return args[0].asString();
    }

    /** Converts the input to an integer */
    public static async int(context: IEvaluationContext, args: IValue[]): Promise<IValue<number | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'int');
        return args[0].asInt();
    }

    /** Converts the input to a float */
    public static async float(context: IEvaluationContext, args: IValue[]): Promise<IValue<number | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'float');
        return args[0].asFloat();
    }

    /** Converts the input to a boolean */
    public static async bool(context: IEvaluationContext, args: IValue[]): Promise<IValue<boolean | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'bool');
        return args[0].asBoolean();
    }

    /** Normalizes the input string using multiple AbuseFilter functions */
    public static async norm(context: IEvaluationContext, args: IValue[]): Promise<Value<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'norm');
        if (args[0].isUndefined) return Value.Undefined;

        let output = await AbuseFilterFunctions.normalizeConfusibleCharacters(args[0].asString().value!);
        output = AbuseFilterFunctions.removeRepeatingCharacters(output);
        output = AbuseFilterFunctions.removeSpecialCharacters(output);
        output = AbuseFilterFunctions.removeWhitespaces(output);
        return new Value(ValueDataType.String, output);
    }

    /** Normalizes the input string, replacing confusible characters by a class representant */
    public static async ccnorm(context: IEvaluationContext, args: IValue[]): Promise<Value<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'ccnorm');
        if (args[0].isUndefined) return Value.Undefined;

        const normalized = await AbuseFilterFunctions.normalizeConfusibleCharacters(args[0].asString().value!);
        return new Value(ValueDataType.String, normalized);
    }

    /** Checks if the first string contains any of the subsequent ones. All arguments are cc-normalized */
    public static async ccnorm_contains_any(context: IEvaluationContext, args: IValue[]): Promise<Value<boolean | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'ccnorm_contains_any');

        const input = args[0];
        if (input.isUndefined) return Value.Undefined;

        const normalizedInput = await AbuseFilterFunctions.normalizeConfusibleCharacters(input.asString().value!);

        let hasUndefined = false;
        for (let i = 1; i < args.length; i++) {
            if (args[i].isUndefined) {
                hasUndefined = true;
                continue;
            }

            const normalizedArg = await AbuseFilterFunctions.normalizeConfusibleCharacters(args[i].asString().value!);
            const contains = normalizedInput.includes(normalizedArg);
            if (contains) {
                return Value.True;
            }
        }

        return !hasUndefined ? Value.False : Value.Undefined;
    }

    /** Checks if the first string contains all of the subsequent ones. All arguments are cc-normalized */
    public static async ccnorm_contains_all(context: IEvaluationContext, args: IValue[]): Promise<Value<boolean | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'ccnorm_contains_all');

        const input = args[0];
        if (input.isUndefined) return Value.Undefined;

        const normalizedInput = await AbuseFilterFunctions.normalizeConfusibleCharacters(input.asString().value!);

        let hasUndefined = false;
        for (let i = 1; i < args.length; i++) {
            if (args[i].isUndefined) {
                hasUndefined = true;
                continue;
            }

            const normalizedArg = await AbuseFilterFunctions.normalizeConfusibleCharacters(args[i].asString().value!);
            const contains = normalizedInput.includes(normalizedArg);
            if (!contains) {
                return Value.False;
            }
        }
        
        return !hasUndefined ? Value.True : Value.Undefined;
    }

    /** Returns the number of non-alphanumeric characters divided by the total number of characters in the argument */
    public static async specialratio(context: IEvaluationContext, args: IValue[]): Promise<Value<number | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'specialratio');
        if (args[0].isUndefined) return Value.Undefined;

        const input = args[0].asString().value!;
        if (input.length === 0) {
            return new Value(ValueDataType.Float, 0);
        }

        const inputNoSpecials = AbuseFilterFunctions.removeSpecialCharacters(input);
        return new Value(ValueDataType.Float, 1 - (inputNoSpecials.length / input.length));
    }

    /** Removes all non-alphanumeric characters from the input */
    public static async rmspecials(context: IEvaluationContext, args: IValue[]): Promise<Value<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'rmspecials');
        if (args[0].isUndefined) return Value.Undefined;

        return new Value(ValueDataType.String, AbuseFilterFunctions.removeSpecialCharacters(args[0].asString().value!));
    }

    /** Removes repeating characters from the input */
    public static async rmdoubles(context: IEvaluationContext, args: IValue[]): Promise<Value<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'rmdoubles');
        if (args[0].isUndefined) return Value.Undefined;

        return new Value(ValueDataType.String, AbuseFilterFunctions.removeRepeatingCharacters(args[0].asString().value!));
    }

    /** Removes whitespace characters from the input */
    public static async rmwhitespace(context: IEvaluationContext, args: IValue[]): Promise<Value<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'rmwhitespace');
        if (args[0].isUndefined) return Value.Undefined;

        return new Value(ValueDataType.String, AbuseFilterFunctions.removeWhitespaces(args[0].asString().value!));
    }

    /**
     * Returns the number of occurrences of the first string in the second one.
     * If a single argument is given, it's split by commas and the number of elements is returned
     */
    public static async count(context: IEvaluationContext, args: IValue[]): Promise<Value<number | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, [1, 2], 'count');
        if (args[0].isUndefined) return Value.Undefined;

        const needle = args[0].asString().value!;
        if (args.length === 1) {
            if (args[0].dataType === ValueDataType.Array) {
                return new Value(ValueDataType.Integer, (args[0] as IValue<unknown[]>).value.length);
            }

            return new Value(ValueDataType.Integer, needle.split(',').length);
        }

        if (needle.length === 0) {
            return new Value(ValueDataType.Integer, 0);
        }

        if (args[1].isUndefined) return Value.Undefined;
        const haystack = args[1].asString().value!;
        let count = 0;
        let index = 0;
        while ((index = haystack.indexOf(needle, index)) !== -1) {
            index += needle.length; // So that "aa" is contained once in "aaa"
            count++;
        }
        return new Value(ValueDataType.Integer, count);
    }

    /**
     * Returns the number of occurrences of the pattern in the second string.
     * If a single argument is given, it's split by commas and the number of elements is returned
     */
    public static async rcount(context: IEvaluationContext, args: IValue[]): Promise<Value<number | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, [1, 2], 'rcount');
        if (args[0].isUndefined) return Value.Undefined;

        const pattern = args[0].asString().value!;
        if (args.length === 1) {
            return new Value(ValueDataType.Integer, pattern.split(',').length);
        }

        if (args[1].isUndefined) return Value.Undefined;
        const input = args[1].asString().value!;
        const regex = RegexUtils.toEcmaRegex(pattern, { g: true, u: true });
        const matches = input.match(regex);
        return new Value(ValueDataType.Integer, matches?.length ?? 0);
    }

    /**
     * Returns an array of all matches of the pattern in the input string.
     * If the pattern is not found, an empty array is returned.
     */
    public static async get_matches(context: IEvaluationContext, args: IValue[]): Promise<Value<Value[] | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 2, 'get_matches');
        if (args[0].isUndefined || args[1].isUndefined) return Value.Undefined;

        const pattern = args[0].asString().value!;
        const input = args[1].asString().value!;
        const regex = RegexUtils.parse(pattern);
        const nativeRegex = RegexUtils.toEcmaRegex(regex, { u: true });
        let matches: RegExpMatchArray | undefined[] | null = input.match(nativeRegex);

        matches ??= Array(1 + regex.countContainedCapturingGroups()).fill(undefined);

        // Now we need to convert the array of strings to an array of Values
        // However, if a group did not match, it will be `undefined` in the array and we replace it into false
        const matchesValues = matches.map(m =>
            m !== undefined ? new Value(ValueDataType.String, m) : Value.False
        );
        return new Value(ValueDataType.Array, matchesValues);
    }

    /** Checks if the IP address is in the specified range */
    public static async ip_in_range(context: IEvaluationContext, args: IValue[]): Promise<Value<boolean | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 2, 'ip_in_range');
        return AbuseFilterFunctions.ip_in_ranges(context, args);
    }

    /** Checks if the IP address is in any of the specified ranges */
    public static async ip_in_ranges(context: IEvaluationContext, args: IValue[]): Promise<Value<boolean | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'ip_in_ranges');
        if (args[0].isUndefined) return Value.Undefined;

        // We want to silence errors from mismatched IP versions being compared
        // and treat such a case as an ordinary "not in range"
        const ip = args[0].asString().value!;
        let hasUndefined = false;
        for (let i = 1; i < args.length; i++) {
            if (args[i].isUndefined) {
                hasUndefined = true;
                continue;
            }
            try {
                const range = args[i].asString().value!;
                if (IPUtils.isInRange(ip, range)) {
                    return Value.True;
                }
            } catch (e) {
                // Ignore, go to the next range
            }
        }
        return !hasUndefined ? Value.False : Value.Undefined;
    }

    /** Checks if the first string contains any of the subsequent ones */
    public static async contains_any(context: IEvaluationContext, args: IValue[]): Promise<Value<boolean | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'contains_any');
        const input = args[0];
        let hasUndefined = false;
        for (let i = 1; i < args.length; i++) {
            const contains = ValueStringOperations.contains(input, args[i]);
            if (contains.isUndefined) {
                hasUndefined = true;
            } else if (contains.isTruthy()) {
                return Value.True;
            }
        }
        return !hasUndefined ? Value.False : Value.Undefined;
    }

    /** Checks if the first string contains all of the subsequent ones */
    public static async contains_all(context: IEvaluationContext, args: IValue[]): Promise<Value<boolean | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'contains_all');
        const input = args[0];
        let hasUndefined = false;
        for (let i = 1; i < args.length; i++) {
            const contains = ValueStringOperations.contains(input, args[i]);
            if (contains.isUndefined) {
                hasUndefined = true;
            } else if (!contains.isTruthy()) {
                return Value.False;
            }
        }
        return !hasUndefined ? Value.True : Value.Undefined;
    }

    /** Checks if the first element is equal to any of the subsequent ones */
    public static async equals_to_any(context: IEvaluationContext, args: IValue[]): Promise<Value<boolean | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'equals_to_any');
        const input = args[0];
        let hasUndefined = false;
        for (let i = 1; i < args.length; i++) {
            const areEqual = ValueComparer.isStrictlyEqualTo(input, args[i]);
            if (areEqual.isUndefined) {
                hasUndefined = true;
            } else if (areEqual.isTruthy()) {
                return Value.True;
            }
        }
        return !hasUndefined ? Value.False : Value.Undefined;
    }

    /** Returns a substring of the input string */
    public static async substr(context: IEvaluationContext, args: IValue[]): Promise<Value<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, 3], 'substr');
        if (args[0].isUndefined || args[1].isUndefined) return Value.Undefined;

        const input = args[0].asString().value!;
        const start = args[1].asInt().value!;

        if (args.length === 2) {
            return new Value(ValueDataType.String, input.substring(start));
        } else {
            if (args[2].isUndefined) return Value.Undefined;
            const length = args[2].asInt().value!;
            const end = Math.min(start + length, input.length);
            return new Value(ValueDataType.String, input.substring(start, end));
        }
    }

    /** Returns the position of the first occurrence of the pattern in the input string */
    public static async strpos(context: IEvaluationContext, args: IValue[]): Promise<Value<number | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, [2, 3], 'strpos');
        if (args[0].isUndefined || args[1].isUndefined) return Value.Undefined;

        const input = args[0].asString().value!;
        const pattern = args[1].asString().value!;
        let offset = 0;
        if (args.length === 3) {
            if (args[2].isUndefined) return Value.Undefined;
            offset = args[2].asInt().value!;
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
    public static async str_replace(context: IEvaluationContext, args: IValue[]): Promise<Value<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 3, 'str_replace');
        if (args.some(v => v.isUndefined)) return Value.Undefined;

        const input = args[0].asString().value!;
        const pattern = args[1].asString().value!;
        const replacement = args[2].asString().value!;
        return new Value(ValueDataType.String, input.replaceAll(pattern, replacement));
    }

    /** Replaces all occurrences of the regex pattern in the input string with the replacement */
    public static async str_replace_regexp(context: IEvaluationContext, args: IValue[]): Promise<Value<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 3, 'str_replace_regexp');
        if (args.some(v => v.isUndefined)) return Value.Undefined;

        const input = args[0].asString().value!;
        const pattern = args[1].asString().value!;
        const replacement = args[2].asString().value!;
        const regex = RegexUtils.toEcmaRegex(pattern, { g: true, u: true });
        return new Value(ValueDataType.String, input.replace(regex, replacement));
    }

    /** Escapes the special characters in the input string */
    public static async rescape(context: IEvaluationContext, args: IValue[]): Promise<Value<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'rescape');
        if (args[0].isUndefined) return Value.Undefined;

        const escaped = RegexUtils.escape(args[0].asString().value!);
        return new Value(ValueDataType.String, escaped);
    }

    /** Sets the variable in the context */
    public static async set(context: IEvaluationContext, args: IValue[]): Promise<IValue> {
        AbuseFilterFunctions.assertArgumentCount(args, 2, 'set');

        const value = args[1];
        if (!args[0].isUndefined) {
            const variableName = args[0].asString().value!;
            context.setVariable(variableName, value);
        }
        return value;
    }

    /** Sanitizes the input string */
    public static async sanitize(context: IEvaluationContext, args: IValue[]): Promise<Value<string | null>> {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'sanitize');
        if (args[0].isUndefined) return Value.Undefined;

        const input = args[0].asString().value!;

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

    private static async normalizeConfusibleCharacters(s: string): Promise<string> {
        const ccnormProvider = AbuseFilterFunctions.ccnormProvider;
        if (ccnormProvider === undefined) {
            throw new Error('CCNormProvider is not specified. Please set AbuseFilterFunctions.ccnormProvider before using ccnorm functions.');
        }

        await ccnormProvider.initializeIfNeeded();
        return ccnormProvider.ccnorm(s);
    }

    //! Utility functions for checking the argument count
    /**
     * Ensures that the provided number of arguments matches the expected count.
     * @param args The arguments actually provided
     * @param expectedCount An expected number of arguments, either a single number or a range [min, max]
     * @param functionName The function name, used for error messages
     */
    private static assertArgumentCount(args: unknown[], expectedCount: number | [number, number], functionName: string): void {
        const providedCount = args.length;
        if (typeof expectedCount === 'number') {
            expectedCount = [expectedCount, expectedCount];
        }

        if (providedCount < expectedCount[0] || providedCount > expectedCount[1]) {
            throw new Error(`Function ${functionName} expects ${expectedCount[0]} to ${expectedCount[1]} arguments, but got ${providedCount}`);
        }
    }
}

type AbuseFilterFunction<T> = (context: IEvaluationContext, args: IValue[]) => Promise<IValue<T>>;
