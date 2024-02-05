import { assert } from 'chai';
import { Tokenizer } from '../../src/parser/Tokenizer.js';
import { TokenType } from '../../src/parser/TokenType.js';

describe('Tokenizer tests', () => {
    it('should tokenize simple string', () => {
        const tokenizer = new Tokenizer();
        const tokens = tokenizer.tokenize('"Hello World"');

        assert.equal(tokens.length, 2);

        const stringToken = tokens[0];
        assert.equal(stringToken.type, TokenType.StringLiteral);
        assert.equal(stringToken.value, 'Hello World');
    });
});