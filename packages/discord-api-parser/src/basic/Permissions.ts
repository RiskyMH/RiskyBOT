import { PermissionFlags } from "lilybird";
import BitField from "./BitField.ts";


export class Permissions extends BitField {

    constructor(permissions: bigint | string ) {
        super(BigInt(permissions));
    }

    /**
     * Checks whether the bitfield has a permission, or multiple permissions.
     * @param permission Permission(s) to check for
     * @param checkAdmin Whether to allow the administrator permission to override
     */
    override has(permission: bigint, checkAdmin = true): boolean {
        return (checkAdmin && super.has(PermissionFlags.ADMINISTRATOR)) || super.has(permission);
    }
}

export default Permissions;