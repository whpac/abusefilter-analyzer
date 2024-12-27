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

    /** Checks if this value is matched by the regex pattern */
    public static testRegex(subject: IValue, pattern: IValue, caseInsensitive: boolean = false): IValue<boolean | null> {
        if (subject.isUndefined || pattern.isUndefined) {
            return Value.Undefined;
        }
        
        const subjectString = subject.asString().value!;
        const patternRegex = RegexUtils.toEcmaRegex(pattern.asString().value!, { i: caseInsensitive, u: true });
        return new Value(ValueDataType.Boolean, patternRegex.test(subjectString));
    }

    /** Checks if this value is matched by the glob pattern */
    public static testGlob(subject: IValue, pattern: IValue): IValue<boolean | null> {
        if (subject.isUndefined || pattern.isUndefined) {
            return Value.Undefined;
        }

        const subjectString = subject.asString().value!;
        let globPattern = pattern.asString().value!;

        // First, escape the pattern according to Regex rules
        globPattern = RegexUtils.escape(globPattern);

        // Then substitute the glob wildcards with regex sequences
        globPattern = globPattern.replace(/\\\*/g, '.*')
            .replace(/\\\?/g, '.')
            .replace(/\\\[!/g, '[^')
            .replace(/\\\[/g, '[')
            .replace(/\\\]/g, ']');

        const patternRegex = new RegExp(globPattern, 'u');
        return new Value(ValueDataType.Boolean, patternRegex.test(subjectString));
    }
}