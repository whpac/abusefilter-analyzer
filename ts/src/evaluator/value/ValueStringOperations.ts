import { IValue } from '../../model/IValue.js';
import { ValueDataType } from '../../model/ValueDataType.js';
import { Value } from './Value.js';
import { RegexUtils } from '../utils/regex/RegexUtils.js';

export class ValueStringOperations {

    /** Checks if this value contains the needle (both are converted to string first) */
    public static contains(haystack: IValue, needle: IValue): IValue<boolean> {
        const thisString = haystack.toString();
        const needleString = needle.toString();

        if (thisString === '' || needleString === '') {
            return Value.False;
        }

        return new Value(ValueDataType.Boolean, thisString.includes(needleString));
    }

    /** Checks if this value is matched by the regex pattern */
    public static testRegex(subject: IValue, pattern: IValue, caseInsensitive: boolean = false): IValue<boolean> {
        const subjectString = subject.toString();
        const patternRegex = RegexUtils.toEcmaRegex(pattern.toString(), { i: caseInsensitive, u: true });
        return new Value(ValueDataType.Boolean, patternRegex.test(subjectString));
    }

    /** Checks if this value is matched by the glob pattern */
    public static testGlob(subject: IValue, pattern: IValue): IValue<boolean> {
        const subjectString = subject.toString();
        let globPattern = pattern.toString();

        // First, escape the pattern according to Regex rules
        // See: https://stackoverflow.com/a/9310752/8127198
        globPattern = globPattern.replace(/[[\]{}()*+?.,\\/^$|\s]/g, '\\$&');

        // Then substitute the glob wildcards with regex sequences
        globPattern = globPattern.replace(/\\\*/g, '.*')
            .replace(/\\\?/g, '.')
            .replace(/\\\[/g, '[')
            .replace(/\\\[!/g, '[^')
            .replace(/\\\]/g, ']');

        const patternRegex = new RegExp(globPattern, 'u');
        return new Value(ValueDataType.Boolean, patternRegex.test(subjectString));
    }
}