
/** A class for representing a bitfield */
export class BitField {
    /** The bitfield */
    readonly bitfield: bigint;

    constructor(bitfield: bigint) {
        this.bitfield = bitfield;
    }

    /** Does the bitfield have this field? */
    has(bit: bigint) {
        bit = BigInt(bit);
        return (this.bitfield & bit) === bit;
    }

    /** Only return the string of the bitfield */
    toString() {
        return this.bitfield.toString();
    }

    /** Only return the string of the bitfield */
    toJSON() {
        return this.bitfield.toString();
    }

}

export default BitField;