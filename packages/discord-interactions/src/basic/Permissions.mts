import { PermissionFlagsBits } from "discord-api-types/v10";
import BitField from "./BitField.mjs";



export default class Permissions extends BitField {

    constructor(permissions: bigint | string ) {
        super(BigInt(permissions));
    }

    /**
     * Checks whether the bitfield has a permission, or multiple permissions.
     * @param permission Permission(s) to check for
     * @param checkAdmin Whether to allow the administrator permission to override
     */
    has(permission: bigint, checkAdmin = true): boolean {
        return (checkAdmin && super.has(PermissionFlagsBits.Administrator)) || super.has(permission);
    }
}