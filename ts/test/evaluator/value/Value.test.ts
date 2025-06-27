import { assert } from 'chai';
import { Value } from '../../../src/evaluator/value/Value.js';
import { ValueDataType } from '../../../src/model/value/ValueDataType.js';

describe('Value tests', () => {
    describe('Value parsing', () => {
        it('should parse null', () => {
            const value = Value.fromNative(null);

            assert.equal(value.dataType, ValueDataType.Null);
            assert.isNull(value.value);
        });

        it('should parse undefined', () => {
            const value = Value.fromNative(undefined);

            assert.equal(value.dataType, ValueDataType.Undefined);
            assert.isNull(value.value);
        });

        it('should parse boolean true', () => {
            const value = Value.fromNative(true);

            assert.equal(value.dataType, ValueDataType.Boolean);
            assert.isTrue(value.value);
        });

        it('should parse integer', () => {
            const value = Value.fromNative(42);

            assert.equal(value.dataType, ValueDataType.Integer);
            assert.equal(value.value, 42);
        });

        it('should parse float', () => {
            const value = Value.fromNative(3.14);

            assert.equal(value.dataType, ValueDataType.Float);
            assert.equal(value.value, 3.14);
        });

        it('should parse string', () => {
            const value = Value.fromNative('Hello, World!');

            assert.equal(value.dataType, ValueDataType.String);
            assert.equal(value.value, 'Hello, World!');
        });

        it('should parse empty string', () => {
            const value = Value.fromNative('');

            assert.equal(value.dataType, ValueDataType.String);
            assert.equal(value.value, '');
        });

        it('should parse array', () => {
            const value = Value.fromNative([1, 'two', true]) as Value<Value[]>;

            assert.equal(value.dataType, ValueDataType.Array);
            assert.isArray(value.value);
            assert.equal(value.value.length, 3);
            assert.equal(value.value[0].dataType, ValueDataType.Integer);
            assert.equal(value.value[1].dataType, ValueDataType.String);
            assert.equal(value.value[2].dataType, ValueDataType.Boolean);
            assert.equal(value.value[0].value, 1);
            assert.equal(value.value[1].value, 'two');
            assert.isTrue(value.value[2].value);
        });

        it('should parse sparse array', () => {
            const value = Value.fromNative({0: 1, 2: 'two', 4: true}) as Value<Value[]>;

            assert.equal(value.dataType, ValueDataType.Array);
            assert.isArray(value.value);
            assert.equal(value.value.length, 5);
            assert.equal(value.value[0].dataType, ValueDataType.Integer);
            assert.equal(value.value[1].dataType, ValueDataType.Null);
            assert.equal(value.value[2].dataType, ValueDataType.String);
            assert.equal(value.value[3].dataType, ValueDataType.Null);
            assert.equal(value.value[4].dataType, ValueDataType.Boolean);
            assert.equal(value.value[0].value, 1);
            assert.isNull(value.value[1].value);
            assert.equal(value.value[2].value, 'two');
            assert.isNull(value.value[3].value);
            assert.isTrue(value.value[4].value);
        });
    });
});