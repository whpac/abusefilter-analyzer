import { assert } from 'chai';
import { IPAddress } from '../../../src/evaluator/utils/IPAddress.js';

describe('IPAddress tests', () => {
    describe('fromV4String', () => {
        it('should parse 127.0.0.1', () => {
            const ip = IPAddress.fromV4String('127.0.0.1');

            assert.isNotNull(ip);
            assert.deepEqual(ip!.parts, [127, 0, 0, 1]);
        });

        it('should parse 255.255.255.255', () => {
            const ip = IPAddress.fromV4String('255.255.255.255');

            assert.isNotNull(ip);
            assert.deepEqual(ip!.parts, [255, 255, 255, 255]);
        });

        it('should parse 0.0.0.0', () => {
            const ip = IPAddress.fromV4String('0.0.0.0');

            assert.isNotNull(ip);
            assert.deepEqual(ip!.parts, [0, 0, 0, 0]);
        });

        it('should not parse 256.0.0.1', () => {
            const ip = IPAddress.fromV4String('256.0.0.1');

            assert.isNull(ip);
        });

        it('should not parse 127.0.0', () => {
            const ip = IPAddress.fromV4String('127.0.0');

            assert.isNull(ip);
        });

        it('should not parse 127..0.1', () => {
            const ip = IPAddress.fromV4String('127..0.1');

            assert.isNull(ip);
        });

        it('should not parse 123.45.67.8.9', () => {
            const ip = IPAddress.fromV4String('123.45.67.8.9');

            assert.isNull(ip);
        });
    });

    describe('fromV6String', () => {
        it('should parse 1:2:3:4:5:6:7:8', () => {
            const ip = IPAddress.fromV6String('1:2:3:4:5:6:7:8');

            assert.isNotNull(ip);
            assert.deepEqual(ip!.parts, [1, 2, 3, 4, 5, 6, 7, 8]);
        });

        it('should parse 1234:5678:90ab:cdef:fedc:ba09:8765:4321', () => {
            const ip = IPAddress.fromV6String('1234:5678:90ab:cdef:fedc:ba09:8765:4321');

            assert.isNotNull(ip);
            assert.deepEqual(ip!.parts, [0x1234, 0x5678, 0x90ab, 0xcdef, 0xfedc, 0xba09, 0x8765, 0x4321]);
        });

        it('should parse 1:2:3:4:5:6::', () => {
            const ip = IPAddress.fromV6String('1:2:3:4:5:6::');

            assert.isNotNull(ip);
            assert.deepEqual(ip!.parts, [1, 2, 3, 4, 5, 6, 0, 0]);
        });

        it('should parse 1:2:3:4::5', () => {
            const ip = IPAddress.fromV6String('1:2:3:4::5');

            assert.isNotNull(ip);
            assert.deepEqual(ip!.parts, [1, 2, 3, 4, 0, 0, 0, 5]);
        });

        it('should parse ::1', () => {
            const ip = IPAddress.fromV6String('::1');

            assert.isNotNull(ip);
            assert.deepEqual(ip!.parts, [0, 0, 0, 0, 0, 0, 0, 1]);
        });

        it('should parse 1::', () => {
            const ip = IPAddress.fromV6String('1::');

            assert.isNotNull(ip);
            assert.deepEqual(ip!.parts, [1, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('should parse ::', () => {
            const ip = IPAddress.fromV6String('::');

            assert.isNotNull(ip);
            assert.deepEqual(ip!.parts, [0, 0, 0, 0, 0, 0, 0, 0]);
        });

        it('should not parse 1:2:3:4:5:6:7:8:9', () => {
            const ip = IPAddress.fromV6String('1:2:3:4:5:6:7:8:9');

            assert.isNull(ip);
        });

        it('should not parse 1:2:3:4:5:6:7', () => {
            const ip = IPAddress.fromV6String('1:2:3:4:5:6:7');

            assert.isNull(ip);
        });

        it('should not parse 1:2:3:4:5:6:::', () => {
            const ip = IPAddress.fromV6String('1:2:3:4:5:6:::');

            assert.isNull(ip);
        });

        it('should not parse 1:2:3:4:5:6::7:8', () => {
            const ip = IPAddress.fromV6String('1:2:3:4:5:6::7:8');

            assert.isNull(ip);
        });

        it('should not parse 1::2:3::4:5:6', () => {
            const ip = IPAddress.fromV6String('1::2:3::4:5:6');

            assert.isNull(ip);
        });
    });
});