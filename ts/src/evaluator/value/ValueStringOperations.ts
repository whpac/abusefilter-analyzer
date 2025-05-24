import { IValue } from '../../model/value/IValue.js';
import { ValueDataType } from '../../model/value/ValueDataType.js';
import { Value } from './Value.js';
import { RegexUtils } from '../utils/regex/RegexUtils.js';

/**
 * Provides string operations for values.
 */
export class ValueStringOperations {

    /** Checks if this value contains the needle (both are converted to string first) */
    public static contains(haystack: IValue, needle: IValue): IValue<boolean | null> {
        if (haystack.isUndefined || needle.isUndefined) {
            return Value.Undefined;
        }

        const thisString = haystack.asString().value!;
        const needleString = needle.asString().value!;

        if (thisString === '' || needleString === '') {
            return Value.False;
        }

        return new Value(ValueDataType.Boolean, thisString.includes(needleString));
    }

    /** Matches the haystack to the substring and returns the place where it occurs */
    public static matchSubstring(haystack: IValue, needle: IValue): Match | null {
        if (haystack.isUndefined || needle.isUndefined) {
            return null;
        }

        const haystackString = haystack.asString().value!;
        const needleString = needle.asString().value!;

        const index = haystackString.indexOf(needleString);
        if (index === -1) {
            return null;
        }

        return {
            start: index,
            end: index + needleString.length,
        };
    }

    /** Checks if this value is matched by the regex pattern */
    public static testRegex(subject: IValue, pattern: IValue, caseInsensitive: boolean = false): IValue<boolean | null> {
        if (subject.isUndefined || pattern.isUndefined) {
            return Value.Undefined;
        }
        
        const subjectString = subject.asString().value!;
        const patternRegex = this.makeRegex(pattern.asString().value!, caseInsensitive);
        return new Value(ValueDataType.Boolean, patternRegex.test(subjectString));
    }

    /** Matches the regex pattern to the subject and returns where it was found */
    public static matchRegex(subject: IValue, pattern: IValue, caseInsensitive: boolean = false): Match | null {
        if (subject.isUndefined || pattern.isUndefined) {
            return null;
        }
        
        const patternRegex = this.makeRegex(pattern.asString().value!, caseInsensitive);
        return this.match(subject.asString().value!, patternRegex);
    }

    /** Converts a regex string into JavaScript regex object */
    private static makeRegex(pattern: string, caseInsensitive: boolean): RegExp {
        return RegexUtils.toEcmaRegex(pattern, { i: caseInsensitive, u: true });
    }

    /** Checks if this value is matched by the glob pattern */
    public static testGlob(subject: IValue, pattern: IValue): IValue<boolean | null> {
        if (subject.isUndefined || pattern.isUndefined) {
            return Value.Undefined;
        }

        const subjectString = subject.asString().value!;
        const patternRegex = this.globToRegex(pattern.asString().value!);
        return new Value(ValueDataType.Boolean, patternRegex.test(subjectString));
    }

    /** Matches the glob pattern to the subject and returns where it was found */
    public static matchGlob(subject: IValue, pattern: IValue): Match | null {
        if (subject.isUndefined || pattern.isUndefined) {
            return null;
        }

        const patternRegex = this.globToRegex(pattern.asString().value!);
        return this.match(subject.asString().value!, patternRegex);
    }

    /** Converts a glob pattern into JavaScript regex object */
    private static globToRegex(pattern: string): RegExp {
        // First, escape the pattern according to Regex rules
        pattern = RegexUtils.escape(pattern);

        // Then substitute the glob wildcards with regex sequences
        pattern = pattern.replace(/\\\*/g, '.*')
            .replace(/\\\?/g, '.')
            .replace(/\\\[!/g, '[^')
            .replace(/\\\[/g, '[')
            .replace(/\\\]/g, ']');

        return new RegExp(pattern, 'u');
    }

    private static match(subject: string, pattern: RegExp): Match | null {
        const match = pattern.exec(subject);

        if (!match) {
            return null;
        }

        return {
            start: match.index,
            end: match.index + match[0].length,
        };
    }
}

export type Match = {
    start: number;
    end: number;
};