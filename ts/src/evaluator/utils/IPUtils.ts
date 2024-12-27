import { IPAddress } from './IPAddress.js';

/**
 * Provides operations on IP addresses and ranges.
 */
export class IPUtils {

    public static isIPv4(ip: string): boolean {
        return IPAddress.fromV4String(ip) !== null;
    }

    public static isIPv6(ip: string): boolean {
        return IPAddress.fromV6String(ip) !== null;
    }

    /**
     * Checks if the IP address is in the given range.
     * 
     * The range can be specified in the following ways:
     * - CIDR notation (e.g. 10.0.0.0/8)
     * - IP range (e.g. 10.0.0.3 - 10.0.2.5)
     * - single IP address (e.g. 10.1.2.3)
     * 
     * @param ip The IP address to check
     * @param range The range to check against
     */
    public static isInRange(ip: string, range: string): boolean {
        const ipAddr = IPAddress.fromString(ip);
        if (ipAddr === null) return false;

        if (range.includes('/')) {
            const [start, end] = IPUtils.getCidrRangeBounds(range);
            return ipAddr.compare(start) >= 0 && ipAddr.compare(end) <= 0;
        }

        if (range.includes('-')) {
            const [start, end] = IPUtils.getHyphenRangeBounds(range);
            return ipAddr.compare(start) >= 0 && ipAddr.compare(end) <= 0;
        }

        const single = IPAddress.fromString(range);
        if (single === null) return false;

        return ipAddr.compare(single) === 0;
    }

    /**
     * Returns the start and end IP addresses of the given CIDR range.
     * @param cidr The CIDR range
     */
    public static getCidrRangeBounds(cidr: string): [IPAddress, IPAddress] {
        const parts = cidr.split('/');
        if (parts.length !== 2) throw new Error('Invalid CIDR notation');

        const ip = IPAddress.fromString(parts[0]);
        if (ip === null) throw new Error('Invalid IP address');

        const mask = parseInt(parts[1]);
        if (isNaN(mask) || mask < 0) throw new Error('Invalid CIDR mask');

        if (ip.type === 'IPv4' && mask > 32) throw new Error('Invalid CIDR mask for IPv4 address');
        if (ip.type === 'IPv6' && mask > 128) throw new Error('Invalid CIDR mask for IPv6 address');

        const partMax = ip.type === 'IPv4' ? 0xff : 0xffff;
        const partSize = ip.type === 'IPv4' ? 8 : 16;

        const startParts: number[] = [];
        const endParts: number[] = [];
        for (let i = 0; i < ip.parts.length; i++) {
            const part = ip.parts[i];

            // If we are in a part that is fully covered by the mask, we can just copy the source
            if ((i + 1) * partSize <= mask) {
                startParts.push(part);
                endParts.push(part);
                continue;
            }

            // If we are in a part that is not covered by the mask, we need to set the start to 0 and the end to the maximum value
            if (i * partSize >= mask) {
                startParts.push(0);
                endParts.push(partMax);
                continue;
            }

            // Else, this part is partially covered by the mask
            const maskBits = mask - i * partSize;
            const rangeBits = partSize - maskBits;
            const partMask = (partMax << rangeBits) & partMax;

            const startPart = part & partMask;
            const endPart = part | (partMask ^ partMax);

            startParts.push(startPart);
            endParts.push(endPart);
        }

        return [new IPAddress(ip.type, startParts), new IPAddress(ip.type, endParts)];
    }

    /**
     * Returns the start and end IP addresses of the given range in a hyphen notation.
     * @param range The IP range
     */
    public static getHyphenRangeBounds(range: string): [IPAddress, IPAddress] {
        const parts = range.split('-');
        if (parts.length !== 2) throw new Error('Invalid IP range');

        const start = IPAddress.fromString(parts[0].trim());
        if (start === null) throw new Error('Invalid start IP address');

        const end = IPAddress.fromString(parts[1].trim());
        if (end === null) throw new Error('Invalid end IP address');

        if (start.type !== end.type) throw new Error('IP address types do not match');

        return [start, end];
    }
}