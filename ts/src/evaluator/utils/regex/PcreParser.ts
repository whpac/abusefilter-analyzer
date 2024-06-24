// For PCRE spec see: https://www.pcre.org/original/doc/html/pcrepattern.html
export class PcreParser {
    protected pcreString: string;
    protected index: number = 0;

    public constructor(pcreString: string) {
        this.pcreString = pcreString;
    }

    /** Return the character at the next position without moving the pointer */
    protected peek(offset: number = 0): string {
        return this.pcreString[this.index + offset];
    }

    /** Moves the pointer and returns the next character */
    protected next(): string {
        return this.pcreString[this.index++];
    }

    /** Returns the current parser state, can be used to restore it */
    protected getState(): { index: number } {
        return { index: this.index };
    }

    /** Restores a previously obtained state */
    protected restoreState(state: { index: number }) {
        this.index = state.index;
    }

    public parse(): PcreGroup {
        // Parse options in form (*UTF8) if needed
        const group = this.parseGroup();
        group.isRoot = true;
        group.makeBackreferencesAbsolute();

        const maxBackreference = group.countContainedCapturingGroups();
        group.reifyBackreferencesAbove(maxBackreference);

        return group;
    }

    protected parseGroup(rootGroup = false): PcreGroup {
        const group = new PcreGroup();

        // Parse group options at the beginning
        if(!rootGroup && this.peek() === '?') {
            // We have some options in this group
            const headerStart = this.index;
            this.next();
            let finishHeader = false;
            let isOptionNegative = false;
            while(!finishHeader && this.index < this.pcreString.length) {
                const optionChar = this.next();
                switch(optionChar) {
                    case ':':
                        group.isCapturing = false;
                        finishHeader = true;
                        break;
                    case 'i':
                    case 'm':
                    case 's':
                    case 'x':
                        group.options.push((isOptionNegative ? '-' : '') + optionChar);
                        break;
                    case '-':
                        isOptionNegative = true;
                        break;
                    case '<':
                        if (this.peek() === '!' || this.peek() === '=') {
                            group.isLookbehind = true;
                            break;
                        }
                    // If not a lookbehind, treat is as a named group
                    // eslint-disable-next-line no-fallthrough
                    case '\'':
                    case 'P': {
                        const endChar = (optionChar === '\'') ? '\'' : '>';
                        if (optionChar === 'P') this.next(); // Skip the opening bracket

                        let name = '';
                        while(this.peek() !== endChar) {
                            name += this.next();
                        }
                        this.next(); // Skip the closing char
                        group.name = name;
                        finishHeader = true;
                        break;
                    }
                    case '=':
                        group.isAssertion = true;
                        finishHeader = true;
                        break;
                    case '!':
                        group.isAssertion = true;
                        group.isNegativeAssertion = true;
                        finishHeader = true;
                        break;
                    default:
                        finishHeader = true;
                        this.index--; // Move back to the character that was not recognized
                        break;
                }
            }
            group.originalHeader = this.pcreString.slice(headerStart, this.index);
        }

        let inEscapeMode = false; // Whether in between of \Q ... \E
        let exitLoop = false;
        while(this.index < this.pcreString.length && !exitLoop) {
            const c = this.next();
            if (!inEscapeMode) {
                switch(c) {
                    case '\\':
                        if (this.peek() === 'Q') {
                            inEscapeMode = true;
                            this.next();
                        } else if (this.peek() === 'E') { // Unmatched \E is ignored
                            this.next();
                        } else {
                            group.addToken(this.parseEscapeSequence(false));
                        }
                        break;
                    case '(':
                        // Check if it's an option setting
                        // Or can be a backreference like (?P=name)
                        if (this.peek() === '?') {
                            let offset = 1;
                            let isOption = true;
                            while (this.peek(offset) !== ')') {
                                const c = this.peek(offset);
                                if (!/[imsx-]/.test(c)) {
                                    isOption = false;
                                    break;
                                }
                                offset++;
                            }

                            if (isOption) {
                                group.addToken(new PcreInternalOption(this.pcreString.slice(this.index - 1, this.index + offset + 1)));
                                this.index += offset + 1;
                                break;
                            } else {
                                if (this.peek(1) === 'P' && this.peek(2) === '=') {
                                    // Named backreference
                                    let name = '';
                                    let offset = 3;
                                    while (this.peek(offset) !== ')') {
                                        name += this.peek(offset);
                                        offset++;
                                    }
                                    this.index += offset + 1;
                                    group.addToken(new PcreBackreference(name, '(?P=' + name + ')'));
                                    break;
                                }
                            }
                        }
                        group.addToken(this.parseGroup());
                        break;
                    case '[':
                        group.addToken(this.parseCharacterClass());
                        break;
                    case ')':
                        exitLoop = true;
                        break;
                    case '{': {
                        const state = this.getState();
                        let min = '';
                        let max = '';
                        let modifier = '';
                        let exact = true;
                        while(this.peek() !== ',' && this.peek() !== '}' && this.index < this.pcreString.length){
                            min += this.next();
                        }
                        if(this.next() === ',') {
                            exact = false;
                            // The max part is optional
                            while(this.peek() !== '}') {
                                max += this.next();
                            }
                            this.next(); // Skip the closing brace
                        }
                        if (['?', '+'].includes(this.peek()) && !exact) {
                            modifier = this.next();
                        }

                        let quantifier: string;
                        if (exact) {
                            quantifier = '{' + min + '}' + modifier;
                        } else {
                            quantifier = '{' + min + ',' + max + '}' + modifier;
                        }

                        // Ensure the quantifier is valid
                        if (/^(\{\d+\}|\{\d+,\d*\}[?+]?)/.test(quantifier)) {
                            group.addToken(new PcreMetacharacter(quantifier));
                        } else {
                            this.restoreState(state);
                            group.addToken(new PcreCharacter(c, c));
                        }
                        break;
                    }
                    default:
                        if (c === '^' || c === '$') {
                            group.addToken(new PcreAnchor(c));
                            break;
                        }

                        if (['*', '+', '?'].includes(c)) {
                            // Store lazy and possessive modifiers
                            if (this.peek() === '?') {
                                this.next();
                                group.addToken(new PcreMetacharacter(c + '?'));
                            } else if (this.peek() === '+') {
                                this.next();
                                group.addToken(new PcreMetacharacter(c + '+'));
                            } else {
                                group.addToken(new PcreMetacharacter(c));
                            }
                            break;
                        }

                        if (['.', '|'].includes(c)) {
                            group.addToken(new PcreMetacharacter(c));
                            break;
                        }
                        group.addToken(new PcreCharacter(c, c));
                }
            } else {
                if (c === '\\' && this.peek() === 'E') {
                    inEscapeMode = false;
                    this.next();
                } else {
                    group.addToken(new PcreCharacter(c, c));
                }
            }
        }

        return group;
    }

    protected parseEscapeSequence(inCharacterClass: boolean): PcreToken {
        // Move to the next character and include it in the current token
        // Preserve the backslash to denote the special meaning of the next character
        const escapedChar = this.next();
        if (escapedChar === 'c') {
            // Control character, always \cx, where x is ASCII character
            const modifier = this.next();
            if ((modifier.codePointAt(0) ?? -1) <= 255) {
                const charCode = modifier.toUpperCase().charCodeAt(0) ^ 0x40;
                return new PcreCharacter(String.fromCharCode(charCode), '\\c' + modifier);
            } else {
                throw new Error(`Invalid control character: \\c${modifier}`);
            }
        }
        else if (escapedChar === 'x') {
            // Hexadecimal character, \xhh or \x{hhhh}
            if (this.peek() === '{') {
                this.next(); // Skip the opening brace
                let hexCode = '';
                while (this.peek() !== '}') {
                    hexCode += this.next();
                }
                this.next(); // Skip the closing brace

                const originalString = '\\x{' + hexCode + '}';
                if (hexCode.length === 0) hexCode = '0';
                return new PcreCharacter(
                    String.fromCodePoint(parseInt(hexCode, 16)),
                    originalString
                );
            } else {
                let hexCode = '';
                for(let j = 0; j < 2; j++) { // up to 2 hex characters
                    if (/[0-9a-h]/i.test(this.peek())) {
                        hexCode += this.next();
                    } else {
                        break;
                    }
                }

                const originalString = '\\x' + hexCode;
                if (hexCode.length === 0) hexCode = '0';
                return new PcreCharacter(
                    String.fromCodePoint(parseInt(hexCode, 16)),
                    originalString
                );
            }
        }
        else if (escapedChar === 'o') {
            // Octal character, \o{ddd...}
            this.next(); // Skip the opening brace
            let octCode = '';
            while (this.peek() !== '}') {
                octCode += this.next();
            }
            this.next(); // Skip the closing brace

            const originalString = '\\o{' + octCode + '}';
            if (octCode.length === 0) octCode = '0';
            return new PcreCharacter(
                String.fromCodePoint(parseInt(octCode, 8)),
                originalString
            );
        }
        else if (/\d/.test(escapedChar)) {
            // Octal character or backreference, up to 3 digits
            let number = escapedChar;
            const permittedDigits = (escapedChar === '0') ? /[0-7]/ : /\d/;
            for(let j = 0; j < 2; j++) {
                if (permittedDigits.test(this.peek())) {
                    number += this.next();
                } else {
                    break;
                }
            }

            if (number.startsWith('0')) {
                // Octal character
                return new PcreCharacter(
                    String.fromCodePoint(parseInt(number, 8)),
                    '\\' + number
                );
            } else {
                // Backreference
                return new PcreBackreference(
                    number,
                    '\\' + number
                );
            }
        }
        else if (escapedChar === 'p' || escapedChar === 'P') {
            // Unicode character class, \p{xx} or \P{xx}
            // or \pX or \p{^xx}
            let charClass = this.next(); // This is either { or a single-character class designator

            if (charClass !== '{') {
                return new PcreWellKnownCharacterClass(
                    '\\' + escapedChar + '{' + charClass + '}',
                    '\\' + escapedChar + charClass
                );
            }
            
            charClass = '';
            while(this.peek() !== '}') {
                charClass += this.next();
            }
            this.next(); // Skip the closing brace

            if (escapedChar === 'p' && charClass.startsWith('^')) {
                return new PcreWellKnownCharacterClass('\\P{' + charClass.slice(1) + '}', '\\p{' + charClass + '}');
            }

            return new PcreWellKnownCharacterClass('\\' + escapedChar + '{' + charClass + '}');
        }
        else if (/[dhsvw]/i.test(escapedChar) || ((escapedChar === 'N' || escapedChar === 'R') && !inCharacterClass)) {
            return new PcreWellKnownCharacterClass('\\' + escapedChar);
        }
        else if (/[ZzA]/.test(escapedChar) || (!inCharacterClass && escapedChar.toLowerCase() === 'b')) {
            return new PcreAnchor('\\' + escapedChar);
        }
        else if (escapedChar === 'g' || escapedChar === 'k') {
            // Backreference syntax: \g1 or \g{1} or \g{-1} or \g<name> or \k<name> or \k'name' or \k{name}
            if (/[-\d]/.test(this.peek())) {
                let number = this.next();
                while (/[-\d]/.test(this.peek())) {
                    number += this.next();
                }
                return new PcreBackreference(number, '\\' + escapedChar + number);
            }
            const startChar = this.next();
            const endChar = { '{': '}', '<': '>', '\'': '\'', '"': '"' }[startChar] ?? startChar;

            let name = '';
            while(this.peek() !== endChar) {
                name += this.next();
            }
            this.next(); // Skip the closing char
            return new PcreBackreference(name, '\\' + escapedChar + startChar + name + endChar);
        }
        else {
            const charMapping: Record<string, string> = {
                'a': '\u0007',
                'b': '\u0008',
                'e': '\u001B',
                'f': '\u000C',
                'n': '\u000A',
                'r': '\u000D',
                't': '\u0009'
            };
            if (escapedChar in charMapping) {
                return new PcreCharacter(charMapping[escapedChar], '\\' + escapedChar);
            } else {
                return new PcreCharacter(escapedChar, '\\' + escapedChar);
            }
        }
    }

    protected parseCharacterClass(): PcreCharacterClass {
        const isNegated = this.peek() === '^';
        if (isNegated) this.next();

        const charClass = new PcreCharacterClass(isNegated);

        let inEscapeMode = false; // Whether in between of \Q ... \E
        while (this.index < this.pcreString.length) {
            const c = this.next();
            if (!inEscapeMode) {
                let token: PcreToken;
                // TODO: Parse [[:alpha:]] and similar
                if (c === '\\') {
                    if (this.peek() === 'Q') {
                        inEscapeMode = true;
                        this.next();
                        continue;
                    } else if (this.peek() === 'E') {
                        inEscapeMode = false;
                        this.next();
                        continue;
                    } else {
                        token = this.parseEscapeSequence(true);
                    }
                } else if (c === ']') {
                    if (charClass.isEmpty) {
                        // Unescaped ] is allowed at the beginning of the character class
                        token = new PcreCharacter(']', ']');
                    } else {
                        break;
                    }
                } else {
                    token = new PcreCharacter(c, c);
                }

                if (this.peek() === '-' && this.peek(1) !== ']') {
                    this.next();
                    const rangeEnd = this.next();
                    const nextToken = (rangeEnd === '\\') ?
                        this.parseEscapeSequence(true) : new PcreCharacter(rangeEnd, rangeEnd);
                    charClass.addCharacter([token, nextToken]);
                } else {
                    charClass.addCharacter(token);
                }
            } else {
                if (c === '\\' && this.peek() === 'E') {
                    inEscapeMode = false;
                    this.next();
                } else {
                    charClass.addCharacter(new PcreCharacter(c, c));
                }
            }
        }
        return charClass;
    }
}

interface PcreToken {
    /**
     * Converts the token to a string that can be used in an ECMA regex.
     * Any escapes are re-escaped so that RegExp constructor can parse them properly.
     */
    toEcmaRegexString(emulateOptions?: EmulateOptions): string;

    /**
     * Returns the original string that was used to create this token.
     */
    getOriginalString(): string;
}

type EmulateOptions = { multiline: boolean, ignoreCase: boolean, inAssertion: boolean, inCharacterClass: boolean };
const getDefaultEmulateOptions: () => EmulateOptions = () => (
    { multiline: false, ignoreCase: false, inAssertion: false, inCharacterClass: false }
);

export class PcreGroup implements PcreToken {
    public isRoot: boolean = false;

    public isCapturing: boolean = true;

    public name: string | null = null;

    // If isAssertion is true, the following describe the type of this assertion
    // If isAssertion is false, the following have no effect on the group
    public isAssertion: boolean = false;
    public isLookbehind: boolean = false;
    public isNegativeAssertion: boolean = false;

    public originalHeader: string = '';

    public readonly options: string[] = [];

    public readonly tokens: PcreToken[] = [];

    public addToken(token: PcreToken) {
        this.tokens.push(token);
    }

    public toEcmaRegexString(emulateOptions?: EmulateOptions): string {
        emulateOptions ??= getDefaultEmulateOptions();

        emulateOptions.ignoreCase ||= this.options.includes('i');
        emulateOptions.multiline ||= this.options.includes('m');
        
        emulateOptions.ignoreCase &&= !this.options.includes('-i');
        emulateOptions.multiline &&= !this.options.includes('-m');
        
        let groupContent = '';
        for(const token of this.tokens) {
            if (token instanceof PcreInternalOption) {
                emulateOptions.ignoreCase ||= token.options.includes('i');
                emulateOptions.multiline ||= token.options.includes('m');

                emulateOptions.ignoreCase &&= !token.options.includes('-i');
                emulateOptions.multiline &&= !token.options.includes('-m');
                continue;
            }
            groupContent += token.toEcmaRegexString(emulateOptions);
        }
        if (this.isRoot) return groupContent;

        let str = '(';
        if (this.isAssertion) {
            str += '?';
            if (this.isLookbehind) str += '<';
            str += this.isNegativeAssertion ? '!' : '=';
            emulateOptions.inAssertion = true;
        } else {
            if (!this.isCapturing) str += '?:';
            else if (this.name !== null) str += `?<${this.name}>`;
        }

        str += groupContent;
        str += ')';
        return str;
    }

    public getOriginalString(): string {
        const groupContent = this.tokens.map(t => t.getOriginalString()).join('');
        if (this.isRoot) return groupContent;

        let str = '(' + this.originalHeader;
        str += groupContent;
        str += ')';
        return str;
    }

    public makeBackreferencesAbsolute(startingGroupIndex: number = 0): void {
        for (const token of this.tokens) {
            if (token instanceof PcreBackreference) {
                token.makeAbsolute(startingGroupIndex);
            } else if (token instanceof PcreGroup) {
                if (token.isCapturing && !token.isAssertion) startingGroupIndex++;
                token.makeBackreferencesAbsolute(startingGroupIndex);
            }
        }
    }

    public countContainedCapturingGroups(): number {
        let count = 0;
        for (const token of this.tokens) {
            if (token instanceof PcreGroup) {
                if (token.isCapturing && !token.isAssertion) count++;
                count += token.countContainedCapturingGroups();
            }
        }
        return count;
    }

    public reifyBackreferencesAbove(numberOfGroups: number): void {
        // \1 to \9 are always backreferences!
        for (let i = 0; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            if (token instanceof PcreBackreference) {
                if (token.isNumbered && token.number! > numberOfGroups && token.number! > 9) {
                    // Insert substitutes instead of the backreference
                    const substitutes = token.reifyBackreference();
                    this.tokens.splice(i, 1, ...substitutes);
                }
            } else if (token instanceof PcreGroup) {
                token.reifyBackreferencesAbove(numberOfGroups);
            }
        }
    }
}

class PcreCharacterClass implements PcreToken {
    private readonly isNegated: boolean;
    private readonly characters: (PcreToken | PcreCharacterClass | [PcreToken, PcreToken])[] = [];

    public get isEmpty(): boolean {
        return this.characters.length === 0;
    }

    public constructor(isNegated: boolean) {
        this.isNegated = isNegated;
    }

    public addCharacter(character: PcreToken | PcreCharacterClass | [PcreToken, PcreToken]) {
        this.characters.push(character);
    }

    public toEcmaRegexString(emulateOptions?: EmulateOptions): string {
        emulateOptions ??= getDefaultEmulateOptions();
        emulateOptions.inCharacterClass = true;

        let str = '[';
        if (this.isNegated) str += '^';
        str += this.characters.map(t => {
            if (Array.isArray(t)) {
                return this.makeEcmaStringForRange(emulateOptions!, t[0], t[1]);
            } else {
                return t.toEcmaRegexString(emulateOptions);
            }
        }).join('');
        str += ']';
        return str;
    }

    public getOriginalString(): string {
        let str = '[';
        if (this.isNegated) str += '^';
        str += this.characters.map(t => {
            if (Array.isArray(t)) {
                return t.map(tt => tt.getOriginalString()).join('-');
            } else {
                return t.getOriginalString();
            }
        }).join('');
        str += ']';
        return str;
    }

    private makeEcmaStringForRange(emulateOptions: EmulateOptions, token1: PcreToken, token2: PcreToken): string {
        const emulateOptionsCopy = { ...emulateOptions };
        emulateOptionsCopy.ignoreCase = false; // So that the character won't do its own adjustments

        const str1 = token1.toEcmaRegexString(emulateOptionsCopy);
        const str2 = token2.toEcmaRegexString(emulateOptionsCopy);

        if (!emulateOptions.ignoreCase) {
            return str1 + '-' + str2;
        }

        const isUpperCase = (c: string) => c === c.toUpperCase() && c !== c.toLowerCase();
        const isLowerCase = (c: string) => c === c.toLowerCase() && c !== c.toUpperCase();
        const isNoCase = (c: string) => !isUpperCase(c) && !isLowerCase(c);
        const areSameCase = (c1: string, c2: string) => isUpperCase(c1) === isUpperCase(c2) && !isNoCase(c1);

        // If the two characters are the same case, we can just use the range two times
        if (areSameCase(str1, str2)) {
            return str1.toLowerCase() + '-' + str2.toLowerCase() + str1.toUpperCase() + '-' + str2.toUpperCase();
        }

        // Iterate over the range and list all the upper- and lowercase subranges to include
        // The resulting regex will not be optimal, but it should contain all the necessary characters
        const sameCaseSubranges: [string, string][] = [];
        const addSubrange = (start: string, end: string) => {
            // We need to have .toLowerCase() and .toUpperCase() to emulate the case-insensitive behavior
            sameCaseSubranges.push([start.toLowerCase(), end.toLowerCase()]);
            sameCaseSubranges.push([start.toUpperCase(), end.toUpperCase()]);
        };

        let currentSubrangeStart: string | null = null;
        let currentSubrangeEnd: string | null = null;

        const codePointStart = str1.codePointAt(0)!;
        const codePointEnd = str2.codePointAt(0)!;
        for(let i = codePointStart; i <= codePointEnd; i++) {
            const c = String.fromCodePoint(i);

            if (currentSubrangeStart === null) {
                if (!isNoCase(c)) {
                    currentSubrangeStart = c;
                    currentSubrangeEnd = c;
                }
            } else {
                // Continue the current subrange
                if (areSameCase(currentSubrangeStart, c)) {
                    currentSubrangeEnd = c;
                } else {
                    // We either stumbled upon a different case or a symbol
                    // In any case, we finish the current subrange
                    addSubrange(currentSubrangeStart, currentSubrangeEnd!);

                    // Either start a new subrange or reset the current one
                    currentSubrangeStart = isNoCase(c) ? null : c;
                    currentSubrangeEnd = currentSubrangeStart;
                }
            }
        }

        if (currentSubrangeStart !== null && currentSubrangeEnd !== null) {
            addSubrange(currentSubrangeStart, currentSubrangeEnd);
        }

        let rangeString = str1 + '-' + str2;
        for(const [start, end] of sameCaseSubranges) {
            if (codePointStart <= start.codePointAt(0)! && end.codePointAt(0)! <= codePointEnd) {
                continue; // The range is already covered
            }

            if (start === end) {
                rangeString += start;
            } else {
                rangeString += start + '-' + end;
            }
        }
        return rangeString;
    }
}

class PcreWellKnownCharacterClass implements PcreToken {
    private readonly classDesignator: string;
    private readonly originalString: string;

    public constructor(classDesignator: string, originalString?: string) {
        this.classDesignator = classDesignator;
        this.originalString = originalString ?? classDesignator;
    }

    public toEcmaRegexString(emulateOptions?: EmulateOptions): string {
        emulateOptions ??= getDefaultEmulateOptions();

        // \h is not supported in ECMA regex
        if (this.classDesignator.toLowerCase() === '\\h') {
            const useNegative = this.classDesignator === '\\H';
            const horizontalSpaces = [
                0x9, 0x20, 0xa0, 0x1680, 0x180e, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004,
                0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x202f, 0x205f, 0x3000
            ];

            const characters = horizontalSpaces.map(c => '\\u{' + c.toString(16) + '}').join('');
            if (emulateOptions.inCharacterClass) return characters;

            let str = '[';
            if (useNegative) str += '^';
            str += characters;
            str += ']';
            return str;
        }
        // \v is not supported in ECMA regex
        if (this.classDesignator.toLowerCase() === '\\v') {
            const useNegative = this.classDesignator === '\\V';
            const verticalSpaces = [
                0xa, 0xb, 0xc, 0xd, 0x85, 0x2028, 0x2029
            ];

            const characters = verticalSpaces.map(c => '\\u{' + c.toString(16) + '}').join('');
            if (emulateOptions.inCharacterClass) return characters;

            let str = '[';
            if (useNegative) str += '^';
            str += characters;
            str += ']';
            return str;
        }
        // \N and \R are not supported in ECMA regex
        if (this.classDesignator === '\\R') {
            if (emulateOptions.inCharacterClass) return '\\n\\r\\f\\x0b\\x85\\u2028\\u2029';
            return '(?:\\n|\\r|\\r\\n|\\f|\\x0b|\\x85|\\u2028|\\u2029)';
        }
        if (this.classDesignator === '\\N') {
            return '[^\\n\\r\\f\\x0b\\x85\\u2028\\u2029]';
        }

        return this.classDesignator;
    }

    public getOriginalString(): string {
        return this.originalString;
    }
}

/* [:...:] style classes (TODO: find a way to implement this as \p{...} or others)
  alnum    \p{Xan}       letters and digits
  alpha    \p{L}         letters
  ascii    [\0-\xff]     character codes 0 - 127
  blank    \h            space or tab only
  cntrl    \p{Cc}        control characters
  digit    \p{Nd}        decimal digits (same as \d)
  graph                  printing characters, excluding space
  lower    \p{Ll}        lower case letters
  print                  printing characters, including space
  punct    [\p{S}\p{P}]  printing characters, excluding letters and digits and space
  space    \p{Xps}       white space (the same as \s from PCRE 8.34)
  upper    \p{Lu}        upper case letters
  word     \p{Xwd}       "word" characters (same as \w)
  xdigit   [\da-fA-F]    hexadecimal digits
*/

class PcreAnchor implements PcreToken {
    private readonly anchor: string;

    public constructor(anchor: string) {
        this.anchor = anchor;
    }

    public toEcmaRegexString(emulateOptions?: EmulateOptions): string {
        emulateOptions ??= getDefaultEmulateOptions();

        // Word boundary are supported in ECMA regex
        if (this.anchor.toLowerCase() === '\\b') return this.anchor;
        
        /* Transform in multiline
            ^ -> (?:^|(?<=\n))
            $ -> (?:$|(?=\n))

            Transform always
            \A -> ^
            \Z -> \n?$
            \z -> $
        */
        if (emulateOptions.multiline) {
            // We don't place assertions into assertions
            if (this.anchor === '^') return !emulateOptions.inAssertion ? '(?:^|(?<=\\n))' : '(?:^|\\n)';
            if (this.anchor === '$') return !emulateOptions.inAssertion ? '(?:$|(?=\\n))' : '(?:$|\\n)';
        }

        if (this.anchor === '\\A') return '^';
        if (this.anchor === '\\Z') return '\\n?$';
        if (this.anchor === '\\z') return '$';
        return this.anchor;
    }

    public getOriginalString(): string {
        return this.anchor;
    }

}

class PcreMetacharacter implements PcreToken {
    private readonly character: string;

    public constructor(character: string) {
        this.character = character;
    }

    public toEcmaRegexString(): string {
        return this.character;
    }

    public getOriginalString(): string {
        return this.character;
    }
}

class PcreCharacter implements PcreToken {
    private readonly character: string;
    private readonly originalString: string;

    public constructor(character: string, originalString: string) {
        this.character = character;
        this.originalString = originalString;
    }

    public toEcmaRegexString(emulateOptions?: EmulateOptions): string {
        emulateOptions ??= getDefaultEmulateOptions();

        // For readability, instead of using numeric escape
        switch(this.character) {
            case '\0': return '\\0';
            case '\n': return '\\n';
            case '\r': return '\\r';
            case '\t': return '\\t';
            case '\v': return '\\v';
            case '\f': return '\\f';
        }

        if(!/\p{L}|\p{M}|\p{N}|\p{P}|\p{S}|\p{Zs}/.test(this.character)) {
            // Non-printable character, per https://en.wikipedia.org/wiki/Graphic_character#Unicode
            const codePoint = this.character.codePointAt(0);
            if(codePoint !== undefined && codePoint <= 31) {
                const hexCode = codePoint.toString(16);
                if (hexCode.length <= 2) return '\\x' + hexCode.padStart(2, '0');
                if (hexCode.length <= 4) return '\\u' + hexCode.padStart(4, '0');
                return '\\u{' + hexCode + '}';
            }
        }

        if (['.', '^', '$', '*', '+', '?', '(', ')', '[', ']', '{', '}', '|', '\\'].includes(this.character)) {
            return '\\' + this.character;
        }

        if (this.character === '-' && emulateOptions.inCharacterClass) {
            return '\\-';
        }

        if (emulateOptions.ignoreCase) {
            const lowercase = this.character.toLowerCase();
            const uppercase = this.character.toUpperCase();
            if (lowercase !== uppercase) {
                const chars = lowercase + uppercase;
                if (emulateOptions.inCharacterClass) return chars; // Don't duplicate the brackets
                return '[' + chars + ']';
            }
        }

        return this.character;
    }

    public getOriginalString(): string {
        return this.originalString;
    }
}

class PcreBackreference implements PcreToken {
    private patternRef: string; // Number or name
    private readonly originalString: string;

    public get isRelative(): boolean {
        return /^-\d+$/.test(this.patternRef);
    }

    public get isNumbered(): boolean {
        return /^-?\d+$/.test(this.patternRef);
    }

    public get number(): number | null {
        return this.isNumbered ? parseInt(this.patternRef) : null;
    }

    public constructor(patternRef: string, originalString: string) {
        this.patternRef = patternRef;
        this.originalString = originalString;
    }

    public toEcmaRegexString(): string {
        if (this.isNumbered) {
            return '\\' + this.patternRef;
        } else {
            return '\\k<' + this.patternRef + '>';
        }
    }

    public getOriginalString(): string {
        return this.originalString;
    }

    public makeAbsolute(lastGroupNumber: number): void {
        if (this.isRelative) {
            const relativeIndex = parseInt(this.patternRef);
            this.patternRef = (lastGroupNumber + relativeIndex + 1).toString();
        }
    }

    public reifyBackreference(): PcreToken[] {
        // Named and relative backreferences can't be reified
        // In order to reify a relative backreference, one has to make it absolute first
        if (!this.isNumbered || this.isRelative) return [ this ];

        let octalCode = '';
        for (const c of this.patternRef) {
            if (!/[0-7]/.test(c)) break;
            octalCode += c;
        }
        let charCode = 0;
        if (octalCode.length > 0) {
            charCode = parseInt(octalCode, 8);
        }

        const reified: PcreToken[] = [
            new PcreCharacter(String.fromCodePoint(charCode), '\\' + octalCode)
        ];

        if (octalCode.length < this.patternRef.length) {
            const rest = this.patternRef.slice(octalCode.length);
            for (const c of rest) {
                reified.push(new PcreCharacter(c, c));
            }
        }
        return reified;
    }
}

class PcreInternalOption implements PcreToken {
    public readonly options: string[];
    private readonly originalString: string;

    public constructor(originalString: string) {
        this.originalString = originalString;
        this.options = [];

        // Strip (? and )
        const optionString = originalString.slice(2, -1);
        let negativeOptions = false;
        for(const option of optionString) {
            if (option === '-') {
                negativeOptions = true;
                continue;
            }
            if (negativeOptions) {
                this.options.push('-' + option);
            } else {
                this.options.push(option);
            }
        }
    }

    public toEcmaRegexString(): string {
        return '';
    }

    public getOriginalString(): string {
        return this.originalString;
    }
}