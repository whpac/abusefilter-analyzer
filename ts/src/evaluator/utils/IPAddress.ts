/**
 * Represents an IP address.
 */
export class IPAddress {
    /** Type of this IP address */
    public readonly type: IPAddressType;

    /** Numerically encoded parts of this address. Includes also the implicit parts for IPv6 */
    public readonly parts: readonly number[];

    public constructor(type: IPAddressType, parts: number[]) {
        this.type = type;
        this.parts = parts;

        if (type === 'IPv4') {
            if (parts.length !== 4) throw new Error('Invalid number of parts for IPv4 address');
            for (const part of parts) {
                if (part < 0 || part > 255) throw new Error('Invalid part for IPv4 address');
            }
        } else {
            if (parts.length !== 8) throw new Error('Invalid number of parts for IPv6 address');
            for (const part of parts) {
                if (part < 0 || part > 65535) throw new Error('Invalid part for IPv6 address');
            }
        }
    }

    /**
     * Compares this IP address to another one.
     * @param other The other IP address to compare to
     * @returns 0 if addresses are equal, -1 if this address is smaller, 1 if this address is larger
     */
    public compare(other: IPAddress): number {
        if (this.type !== other.type) throw new Error('Cannot compare different IP address types');

        for (let i = 0; i < this.parts.length; i++) {
            if (this.parts[i] < other.parts[i]) return -1;
            if (this.parts[i] > other.parts[i]) return 1;
        }

        return 0;
    }

    /**
     * Creates a new IPAddress object from a string. Returns null if the string is not a valid IP address.
     * @param ip The IP address string
     */
    public static fromString(ip: string): IPAddress | null {
        return IPAddress.fromV4String(ip) ?? IPAddress.fromV6String(ip);
    }

    /**
     * Creates a new IPAddress object from a IPv4 string. Returns null if the string is not a valid IPv4 address.
     * @param ip The IP address string
     */
    public static fromV4String(ip: string): IPAddress | null {
        const parts = ip.split('.');
        if (parts.length !== 4) return null;

        const partsNum = parts.map(part => parseInt(part));
        for (const num of partsNum) {
            if (isNaN(num) || num < 0 || num > 255) return null;
        }

        return new IPAddress('IPv4', partsNum);
    }

    /**
     * Creates a new IPAddress object from a IPv6 string. Returns null if the string is not a valid IPv6 address.
     * @param ip The IP address string
     */
    public static fromV6String(ip: string): IPAddress | null {
        if(ip.includes(':::')) return null;

        const doubleColons = (ip.match(/::/g) || []).length;
        if (doubleColons > 1) return null;

        const colonCount = (ip.match(/:/g) || []).length;
        if (colonCount > 7) return null;

        // Ensure that our IP has 7 colons, i.e. 8 parts
        // Some parts may be empty, they will be trated as zeros
        // 9 - colonCount: we're adding (7-colonCount) colons, but the double colon is removed
        const filled = ip.replace('::', ':'.repeat(9 - colonCount));
        const parts = filled.split(':').map(part => part === '' ? '0' : part);

        if (parts.length != 8) return null;

        const partsNum = parts.map(part => parseInt(part, 16));
        for (const num of partsNum) {
            if (isNaN(num) || num < 0 || num > 65535) return null;
        }

        return new IPAddress('IPv6', partsNum);
    }
}

type IPAddressType = 'IPv4' | 'IPv6';
