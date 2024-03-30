import { assert } from 'chai';
import { PcreParser } from '../../../../src/evaluator/utils/regex/PcreParser.js';

describe('PcreParser tests', () => {
    describe('Not nested regexes', () => {
        it('should parse a single character', () => {
            const parser = new PcreParser('a');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[0].getOriginalString(), 'a');
        });
    
        it('should parse a string of literals', () => {
            const parser = new PcreParser('abc');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 3);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[1].toEcmaRegexString(), 'b');
            assert.equal(group.tokens[2].toEcmaRegexString(), 'c');
        });
    
        it('should parse a single escaped character', () => {
            const parser = new PcreParser('\\\\a');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.tokens[0].toEcmaRegexString(), '\\\\');
            assert.equal(group.tokens[0].getOriginalString(), '\\\\');
            assert.equal(group.tokens[1].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[1].getOriginalString(), 'a');
        });
    
        it('should parse an escaped character with no meaning as escape', () => {
            const parser = new PcreParser('\\F');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'F');
            assert.equal(group.tokens[0].getOriginalString(), '\\F');
        });
    
        it('should parse an internal option', () => {
            const parser = new PcreParser('a(?i-m)b');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 3);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[1].toEcmaRegexString(), '');
            assert.equal(group.tokens[2].toEcmaRegexString(), 'b');
            assert.equal(group.tokens[0].getOriginalString(), 'a');
            assert.equal(group.tokens[1].getOriginalString(), '(?i-m)');
            assert.equal(group.tokens[2].getOriginalString(), 'b');
        });

        it('should parse \\Q and \\E properly', () => {
            const parser = new PcreParser('a\\Q(b)\\E');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 4);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[0].getOriginalString(), 'a');
            assert.equal(group.tokens[1].toEcmaRegexString(), '\\(');
            assert.equal(group.tokens[1].getOriginalString(), '(');
            assert.equal(group.tokens[2].toEcmaRegexString(), 'b');
            assert.equal(group.tokens[2].getOriginalString(), 'b');
            assert.equal(group.tokens[3].toEcmaRegexString(), '\\)');
            assert.equal(group.tokens[3].getOriginalString(), ')');
        });

        it('should parse a lone \\E properly', () => {
            const parser = new PcreParser('a\\Eb');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[0].getOriginalString(), 'a');
            assert.equal(group.tokens[1].toEcmaRegexString(), 'b');
            assert.equal(group.tokens[1].getOriginalString(), 'b');
        });

        it('should parse a lone \\Q properly', () => {
            const parser = new PcreParser('a\\Q(b)');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 4);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[0].getOriginalString(), 'a');
            assert.equal(group.tokens[1].toEcmaRegexString(), '\\(');
            assert.equal(group.tokens[1].getOriginalString(), '(');
            assert.equal(group.tokens[2].toEcmaRegexString(), 'b');
            assert.equal(group.tokens[2].getOriginalString(), 'b');
            assert.equal(group.tokens[3].toEcmaRegexString(), '\\)');
            assert.equal(group.tokens[3].getOriginalString(), ')');
        });

        it('should parse begin and end assertions', () => {
            const parser = new PcreParser('^a$');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 3);
            assert.equal(group.tokens[0].toEcmaRegexString(), '^');
            assert.equal(group.tokens[0].getOriginalString(), '^');
            assert.equal(group.tokens[1].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[1].getOriginalString(), 'a');
            assert.equal(group.tokens[2].toEcmaRegexString(), '$');
            assert.equal(group.tokens[2].getOriginalString(), '$');
        });
    });

    describe('Groups', () => {
        it('should parse a simple group', () => {
            const parser = new PcreParser('(a)');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '(a)');
            assert.equal(group.getOriginalString(), '(a)');
        });

        it('should parse a group with an internal option', () => {
            const parser = new PcreParser('(a(?i-m)b)');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '(a[bB])');
            assert.equal(group.getOriginalString(), '(a(?i-m)b)');
        });

        it('should parse a group with an internal option and a nested group', () => {
            const parser = new PcreParser('(a(?i-m)b(c))');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '(a[bB]([cC]))');
            assert.equal(group.getOriginalString(), '(a(?i-m)b(c))');
        });

        it('should parse a non-captruing group', () => {
            const parser = new PcreParser('(?:a)');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '(?:a)');
            assert.equal(group.getOriginalString(), '(?:a)');
        });

        it('should parse a non-captruing group with an option', () => {
            const parser = new PcreParser('(?i:a)');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '(?:[aA])');
            assert.equal(group.getOriginalString(), '(?i:a)');
        });

        it('should parse a named group', () => {
            const parser = new PcreParser('(?<name>a)');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '(?<name>a)');
            assert.equal(group.getOriginalString(), '(?<name>a)');
        });

        it('should parse a named group in Python syntax', () => {
            const parser = new PcreParser('(?P<name>a)');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '(?<name>a)');
            assert.equal(group.getOriginalString(), '(?P<name>a)');
        });

        it('should parse a lookbehind assertion', () => {
            const parser = new PcreParser('(?<=a)');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '(?<=a)');
            assert.equal(group.getOriginalString(), '(?<=a)');
        });
    });

    describe('Quantifiers', () => {
        it('should parse a simple quantifier', () => {
            const parser = new PcreParser('a+');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[0].getOriginalString(), 'a');
            assert.equal(group.tokens[1].toEcmaRegexString(), '+');
            assert.equal(group.tokens[1].getOriginalString(), '+');
        });

        it('should parse a quantifier with a group', () => {
            const parser = new PcreParser('(a)+');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.tokens[0].toEcmaRegexString(), '(a)');
            assert.equal(group.tokens[0].getOriginalString(), '(a)');
            assert.equal(group.tokens[1].toEcmaRegexString(), '+');
            assert.equal(group.tokens[1].getOriginalString(), '+');
        });

        it('should parse a lazy quantifier', () => {
            const parser = new PcreParser('a+?');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[0].getOriginalString(), 'a');
            assert.equal(group.tokens[1].toEcmaRegexString(), '+?');
            assert.equal(group.tokens[1].getOriginalString(), '+?');
        });

        it('should parse an exact number quantifier', () => {
            const parser = new PcreParser('a{3}');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[0].getOriginalString(), 'a');
            assert.equal(group.tokens[1].toEcmaRegexString(), '{3}');
            assert.equal(group.tokens[1].getOriginalString(), '{3}');
        });

        it('should parse a range quantifier', () => {
            const parser = new PcreParser('a{3,5}');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[0].getOriginalString(), 'a');
            assert.equal(group.tokens[1].toEcmaRegexString(), '{3,5}');
            assert.equal(group.tokens[1].getOriginalString(), '{3,5}');
        });

        it('should parse a range quantifier with a lazy modifier', () => {
            const parser = new PcreParser('a{3,5}?');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[0].getOriginalString(), 'a');
            assert.equal(group.tokens[1].toEcmaRegexString(), '{3,5}?');
            assert.equal(group.tokens[1].getOriginalString(), '{3,5}?');
        });

        it('should parse an open range quantifier', () => {
            const parser = new PcreParser('a{3,}');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.tokens[0].toEcmaRegexString(), 'a');
            assert.equal(group.tokens[0].getOriginalString(), 'a');
            assert.equal(group.tokens[1].toEcmaRegexString(), '{3,}');
            assert.equal(group.tokens[1].getOriginalString(), '{3,}');
        });
    });

    describe('Character classes', () => {
        it('should parse a simple character class', () => {
            const parser = new PcreParser('[abc]');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '[abc]');
            assert.equal(group.getOriginalString(), '[abc]');
        });

        it('should parse a negated character class', () => {
            const parser = new PcreParser('[^abc]');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '[^abc]');
            assert.equal(group.getOriginalString(), '[^abc]');
        });

        it('should parse a range character class', () => {
            const parser = new PcreParser('[a-z]');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '[a-z]');
            assert.equal(group.getOriginalString(), '[a-z]');
        });

        it('should parse a character class with ] and hyphen', () => {
            const parser = new PcreParser('[]a-]');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '[\\]a\\-]');
            assert.equal(group.getOriginalString(), '[]a-]');
        });

        it('should expand a \\V character class', () => {
            const parser = new PcreParser('\\V');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '[^\\u{a}\\u{b}\\u{c}\\u{d}\\u{85}\\u{2028}\\u{2029}]');
            assert.equal(group.getOriginalString(), '\\V');
        });

        it('should expand a \\v in a negated character class', () => {
            const parser = new PcreParser('[^a\\v]');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 1);
            assert.equal(group.toEcmaRegexString(), '[^a\\u{a}\\u{b}\\u{c}\\u{d}\\u{85}\\u{2028}\\u{2029}]');
            assert.equal(group.getOriginalString(), '[^a\\v]');
        });

        it('should emulate case insensitivity in a character class', () => {
            const parser = new PcreParser('(?i)[ab]');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.toEcmaRegexString(), '[aAbB]');
            assert.equal(group.getOriginalString(), '(?i)[ab]');
        });

        it('should emulate case insensitivity in a character class with a range', () => {
            const parser = new PcreParser('(?i)[a-c]');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.toEcmaRegexString(), '[a-cA-C]');
            assert.equal(group.getOriginalString(), '(?i)[a-c]');
        });

        it('should emulate case insensitivity for a mixed case character class', () => {
            const parser = new PcreParser('(?i)[aB]');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.toEcmaRegexString(), '[aAbB]');
            assert.equal(group.getOriginalString(), '(?i)[aB]');
        });

        it('should emulate case insensitivity for a mixed case character range', () => {
            const parser = new PcreParser('(?i)[M-b]');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.toEcmaRegexString(), '[M-bm-zA-B]');
            assert.equal(group.getOriginalString(), '(?i)[M-b]');
        });
    });

    describe('Backreferences', () => {
        it('should parse a simple numbered backreference', () => {
            const parser = new PcreParser('(a)\\1');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.toEcmaRegexString(), '(a)\\1');
            assert.equal(group.getOriginalString(), '(a)\\1');
        });

        it('should parse a simple named backreference', () => {
            const parser = new PcreParser('(?<name>a)\\k<name>');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.toEcmaRegexString(), '(?<name>a)\\k<name>');
            assert.equal(group.getOriginalString(), '(?<name>a)\\k<name>');
        });

        it('should parse a named backreference using Python syntax', () => {
            const parser = new PcreParser('(?P<name>a)\\g<name>');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.toEcmaRegexString(), '(?<name>a)\\k<name>');
            assert.equal(group.getOriginalString(), '(?P<name>a)\\g<name>');
        });

        it('should parse a named backreference using a number', () => {
            const parser = new PcreParser('(?<name>a)\\g{1}');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.toEcmaRegexString(), '(?<name>a)\\1');
            assert.equal(group.getOriginalString(), '(?<name>a)\\g{1}');
        });

        it('should parse a relative backreference', () => {
            const parser = new PcreParser('(a)(b)\\g{-1}');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 3);
            assert.equal(group.toEcmaRegexString(), '(a)(b)\\2');
            assert.equal(group.getOriginalString(), '(a)(b)\\g{-1}');
        });

        it('should skip uncaptruing groups in backreference counting', () => {
            const parser = new PcreParser('(a)(?:b)\\k\'-1\'');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 3);
            assert.equal(group.toEcmaRegexString(), '(a)(?:b)\\1');
            assert.equal(group.getOriginalString(), '(a)(?:b)\\k\'-1\'');
        });

        it('should replace a non-existing backreference with a hex escape', () => {
            const parser = new PcreParser('(a)\\10');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.toEcmaRegexString(), '(a)\\x08');
            assert.equal(group.getOriginalString(), '(a)\\10');
        });

        it('should replace a non-existing backreference with an escape and literals', () => {
            const parser = new PcreParser('(a)\\81');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 4);
            assert.equal(group.toEcmaRegexString(), '(a)\\081');
            assert.equal(group.getOriginalString(), '(a)\\81');
        });

        it('should not replace low backreferences with hex escapes', () => {
            const parser = new PcreParser('(a)\\2');
            const group = parser.parse();
    
            assert.equal(group.tokens.length, 2);
            assert.equal(group.toEcmaRegexString(), '(a)\\2');
            assert.equal(group.getOriginalString(), '(a)\\2');
        });
    });
});