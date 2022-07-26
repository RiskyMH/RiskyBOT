import type { APIRole, APIRoleTags } from "discord-api-types/v10";
import Permissions from "./Permissions.mjs";

/** A role */
export default class Role {

    /** Role id */
    id: string;
    /** Role name */
    name: string;
    /** Integer representation of hexadecimal color code */
    color: number;
    /** If this role is pinned in the user listing */
    hoist: boolean;
    /** The role icon hash */
    icon?: string | null;
    /** Whether this role is managed by an integration */
    managed: boolean;
    /** Whether this role is mentionable */
    mentionable: boolean;
    /** Permission bit set */
    permissions: Permissions;
    /** Position of this role */
    position: number;
    /** The tags this role has */
    tags?: APIRoleTags;
    /** The role unicode emoji as a standard emoji */
    unicodeEmoji?: string | null;


    constructor(role: APIRole) {
        this.id = role.id;
        this.name = role.name;
        this.color = role.color;
        this.hoist = role.hoist;
        this.icon = role.icon;
        this.managed = role.managed;
        this.mentionable = role.mentionable;
        this.permissions = new Permissions(role.permissions);
        this.position = role.position;
        this.tags = role.tags;
        this.unicodeEmoji = role.unicode_emoji;

    }
}