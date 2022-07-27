import type { Config } from "@riskybot/tools";
import { APIInteraction, ApplicationCommandType, ComponentType, InteractionResponseType, InteractionType, OAuth2Scopes } from "discord-api-types/v10";
import type { Request, Response } from "express";
import { verifyKey } from "discord-interactions";
import ButtonInteraction from "./interactions/ButtonComponentInteraction.mjs";
import PingInteraction from "./interactions/PingInteraction.mjs";
import ChatInputInteraction from "./interactions/ChatInputInteraction.mjs";
import UserContextMenuInteraction from "./interactions/UserCommandInteraction.mjs";
import SelectMenuInteraction from "./interactions/SelectMenuComponentInteraction.mjs";
import BaseInteraction from "./interactions/Interaction.mjs";
import AutocompleteInteraction from "./interactions/AutocompleteInteraction.mjs";
import MessageCommandInteraction from "./interactions/MessageCommandInteraction.mjs";
import ModalSubmitInteraction from "./interactions/ModalSubmitInteraction.mjs";
import { DISCORD_API_BASE_URL } from "./constants.mjs";

/**
 * The Interaction :)
 */
export type Interaction = PingInteraction | ChatInputInteraction | UserContextMenuInteraction | ButtonInteraction | SelectMenuInteraction | AutocompleteInteraction | MessageCommandInteraction | ModalSubmitInteraction;


export default class Client {
    /** The Discord bot token */
    token: string;
    /** The ID from the bot */
    id: string;
    /** The public key for the bot */
    publicKey: string;
    /** The config for the bot */
    config: Config;

    

    constructor(data: { bearerToken: string; applicationId: string; publicKey: string }, config: Config)
    constructor(data: { applicationId: string; privateKey: string; publicKey: string }, config: Config)
    constructor(data: { token: string; applicationId: string; publicKey: string }, config: Config)
    constructor(data: { token: string; bearerToken: string; applicationId: string; publicKey: string, privateKey: string }, config: Config) {
        this.token = data.token ? "Bot " + data.token : data.bearerToken ? "Bearer " + data.bearerToken : "";
        if (!this.token) { throw new Error("No token provided"); }
        this.id = data.applicationId;
        this.publicKey = data.publicKey;
        this.config = config;
    }

    verify(request: Request, response: Response): boolean {
        if (request.method !== "POST") { response.status(405).json({ error: "Only can use POST method" }); return false;}
        const signature = request.headers["x-signature-ed25519"]?.toString();
        const timestamp = request.headers["x-signature-timestamp"]?.toString();
        const rawBody = JSON.stringify(request.body);
        if (!signature || !timestamp || !rawBody) { response.status(405).json({ error: "Invalid headers and/or body" }); return false; }

        const isValidRequest = verifyKey(rawBody, signature, timestamp, this.publicKey);
        if (!isValidRequest) {response.status(401).json({ error: "Bad request signature" }); return false;} 

        const interaction: APIInteraction = request.body;

        // Handle PINGs from Discord
        if (interaction.type === InteractionType.Ping) {
            console.info("Handling Ping request");
            
            response.json({ type: InteractionResponseType.Pong });
            return true;
        }

        return true;


    }

    parse(data: APIInteraction): Interaction {
        // Parse the interaction
        return parseRawInteraction(data);
    }

    // async fetchApplication(): Promise<APIApplication> {
        
    //     if (!this.token) this.bearerToken ||= await getBearerTokenFromKey(this.id, this.privateKey, [""]);
        
    //     let authorization = "";
    //     if (this.token) authorization = `Bot ${this.token}`;
    //     else if (this.bearerToken) authorization = `Bearer ${this.bearerToken}`;

    //     const res = await fetch(DISCORD_API_BASE_URL + Routes.oauth2CurrentApplication(), { headers: { "Authorization": authorization } });
    //     const rawApplication = await res.json() as APIApplication;

    //     return rawApplication;
    // }     
    
    generateInvite(data: {scopes: OAuth2Scopes[]}): string {
        return DISCORD_API_BASE_URL + `/oauth2/authorize?client_id=${this.id}&scope=${data.scopes.join(" ")}`;
    }



}


export function parseRawInteraction(data: APIInteraction): Interaction {
    let InteractionClass;

    switch (data.type) {
        case InteractionType.Ping:
            InteractionClass = PingInteraction;
            break;
            
        case InteractionType.ApplicationCommand:
            switch (data.data.type){
                case ApplicationCommandType.ChatInput:
                    InteractionClass = ChatInputInteraction;
                    break;

                case ApplicationCommandType.User:
                    InteractionClass = UserContextMenuInteraction;
                    break;

                case ApplicationCommandType.Message:
                    InteractionClass = MessageCommandInteraction;
                    break;

                default:
                    throw new Error("Unknown ApplicationCommandType");
            }
            break;

        case InteractionType.ApplicationCommandAutocomplete:
            InteractionClass = AutocompleteInteraction;
            break;

        case InteractionType.MessageComponent:
            switch (data.data.component_type) {
                case ComponentType.Button:
                    InteractionClass = ButtonInteraction;
                    break;

                case ComponentType.SelectMenu:
                    InteractionClass = SelectMenuInteraction;
                    break;
                
                default:
                    throw new Error("Unknown ComponentType");
            }
            break;

        case InteractionType.ModalSubmit:
            InteractionClass = ModalSubmitInteraction;
            break;
            
        default:
            throw new Error("Unknown InteractionType");
    }
    InteractionClass ||= BaseInteraction;

    const interaction: Interaction = new InteractionClass(data) as Interaction;
    return interaction;
}
