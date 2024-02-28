import { assert } from 'chai';
import { IPUtils } from '../../../src/evaluator/utils/IPUtils.js';

describe('IPUtils tests', () => {
    describe('CIDR range bounds', () => {
        it('should return bounds for 10.0.0.0/8', () => {
            const bounds = IPUtils.getCidrRangeBounds('10.0.0.0/8');
            
            assert.deepEqual(bounds[0].parts, [10, 0, 0, 0]);
            assert.deepEqual(bounds[1].parts, [10, 255, 255, 255]);
        });

        it('should return bounds for 192.168.1.0/24', () => {
            const bounds = IPUtils.getCidrRangeBounds('192.168.1.0/24');

            assert.deepEqual(bounds[0].parts, [192, 168, 1, 0]);
            assert.deepEqual(bounds[1].parts, [192, 168, 1, 255]);
        });

        it('should return bounds for 10.0.0.20/16', () => {
            const bounds = IPUtils.getCidrRangeBounds('10.0.0.20/16');

            assert.deepEqual(bounds[0].parts, [10, 0, 0, 0]);
            assert.deepEqual(bounds[1].parts, [10, 0, 255, 255]);
        });

        it('should return bounds for 2001:db8::/32', () => {
            const bounds = IPUtils.getCidrRangeBounds('2001:db8::/32');

            assert.deepEqual(bounds[0].parts, [0x2001, 0xdb8, 0, 0, 0, 0, 0, 0]);
            assert.deepEqual(bounds[1].parts, [0x2001, 0xdb8, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff]);
        });
    });

    describe('IP hyphen range bounds', () => {
        it('should return bounds for 10.0.0.0 - 10.0.20.40', () => {
            const bounds = IPUtils.getHyphenRangeBounds('10.0.0.0 - 10.0.20.40');

            assert.deepEqual(bounds[0].parts, [10, 0, 0, 0]);
            assert.deepEqual(bounds[1].parts, [10, 0, 20, 40]);
        });

        it('should return bounds for ::1 - ::10', () => {
            const bounds = IPUtils.getHyphenRangeBounds('::1 - ::10');

            assert.deepEqual(bounds[0].parts, [0, 0, 0, 0, 0, 0, 0, 1]);
            assert.deepEqual(bounds[1].parts, [0, 0, 0, 0, 0, 0, 0, 0x10]);
        });
    });

    describe('IP range check', () => {
        it('should check that 10.0.0.10 is in 10.0.0.0/8', () => {
            assert.isTrue(IPUtils.isInRange('10.0.0.10', '10.0.0.0/8'));
        });

        it('should check that 10.0.0.0 is in 10.0.0.0/8', () => {
            assert.isTrue(IPUtils.isInRange('10.0.0.0', '10.0.0.0/8'));
        });

        it('should check that ::1 is in ::/64', () => {
            assert.isTrue(IPUtils.isInRange('::1', '::/64'));
        });
    });
});