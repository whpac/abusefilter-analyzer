import { assert } from 'chai';
import { Tokenizer } from '../../src/parser/Tokenizer.js';
import { TokenType } from '../../src/parser/TokenType.js';

describe('Tokenizer tests', () => {
    describe('String tokenization', () => {
        it('should tokenize simple string in double quotes', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('"Hello World"');

            assert.equal(tokens.length, 2);

            const firstToken = tokens[0];
            assert.equal(firstToken.type, TokenType.StringLiteral);
            assert.equal(firstToken.value, 'Hello World');
        });

        it('should tokenize simple string in single quotes', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('\'Hello World\'');

            assert.equal(tokens.length, 2);

            const firstToken = tokens[0];
            assert.equal(firstToken.type, TokenType.StringLiteral);
            assert.equal(firstToken.value, 'Hello World');
        });

        it('should tokenize string with escape sequences', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('"Hello\\nWorld"');

            assert.equal(tokens.length, 2);

            const firstToken = tokens[0];
            assert.equal(firstToken.type, TokenType.StringLiteral);
            assert.equal(firstToken.value, 'Hello\nWorld');
        });

        it('should permit single quotes in double quoted string', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('"Hello \'World\'"');

            assert.equal(tokens.length, 2);

            const firstToken = tokens[0];
            assert.equal(firstToken.type, TokenType.StringLiteral);
            assert.equal(firstToken.value, 'Hello \'World\'');
        });

        it('should include escaped quoted in quoted string', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('"Hello \\"World\\""');

            assert.equal(tokens.length, 2);

            const firstToken = tokens[0];
            assert.equal(firstToken.type, TokenType.StringLiteral);
            assert.equal(firstToken.value, 'Hello "World"');
        });

        it('should throw error on unclosed string', () => {
            const tokenizer = new Tokenizer();
            assert.throws(() => tokenizer.tokenize('"Hello World'));
        });
    });

    describe('Number tokenization', () => {
        it('should tokenize integer', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('44');

            assert.equal(tokens.length, 2);

            const firstToken = tokens[0];
            assert.equal(firstToken.type, TokenType.IntLiteral);
            assert.equal(firstToken.value, '44');
        });

        it('should tokenize float', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('4.4');

            assert.equal(tokens.length, 2);

            const firstToken = tokens[0];
            assert.equal(firstToken.type, TokenType.FloatLiteral);
            assert.equal(firstToken.value, '4.4');
        });

        it('should tokenize hex integer', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('0x20');

            assert.equal(tokens.length, 2);

            const firstToken = tokens[0];
            assert.equal(firstToken.type, TokenType.IntLiteral);
            assert.equal(firstToken.value, '32');
        });

        it('should tokenize oct integer', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('0o20');

            assert.equal(tokens.length, 2);

            const firstToken = tokens[0];
            assert.equal(firstToken.type, TokenType.IntLiteral);
            assert.equal(firstToken.value, '16');
        });

        it('should tokenize bin integer', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('0b110');

            assert.equal(tokens.length, 2);

            const firstToken = tokens[0];
            assert.equal(firstToken.type, TokenType.IntLiteral);
            assert.equal(firstToken.value, '6');
        });
    });

    describe('Spaces and comments', () => {
        it('should ignore spaces', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize(' \t\n\r\v\f ');

            assert.equal(tokens.length, 1);
            assert.equal(tokens[0].type, TokenType.EndOfStream);
        });

        it('should ignore comments', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('  /* comment here /* */  ');

            assert.equal(tokens.length, 1);
            assert.equal(tokens[0].type, TokenType.EndOfStream);
        });
    });

    describe('Identifiers and keywords', () => {
        it('should tokenize identifier', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('hello');

            assert.equal(tokens.length, 2);

            const firstToken = tokens[0];
            assert.equal(firstToken.type, TokenType.Identifier);
            assert.equal(firstToken.value, 'hello');
        });

        it('should tokenize keyword', () => {
            const tokenizer = new Tokenizer();
            const tokens = tokenizer.tokenize('if');

            assert.equal(tokens.length, 2);

            const firstToken = tokens[0];
            assert.equal(firstToken.type, TokenType.Keyword);
            assert.equal(firstToken.value, 'if');
        });
    });
});