// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, codeBlock } from "@discordjs/builders";
import { TextInputStyle } from "discord-api-types/v10";
import { Util } from "discord.js";
import { trim } from "@riskybot/tools";
import type { Config } from "@riskybot/tools";


/**
 * @param {import("discord.js").Client} client
 * @return { Promise < import("discord.js").ModalBuilder > }
 */

export async function evalShowModal(client,) {

    let modal = new ModalBuilder()
        .setCustomId("eval")
        .setTitle("Eval")
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder().setStyle(TextInputStyle.Paragraph).setLabel("Code").setPlaceholder("Code to evaluate").setCustomId("code")
            ));
            console.log(modal.toJSON());
            console.log(modal.toJSON().components[0].components);
    return modal;
}


/**
 * @param {import("discord.js").Client} client
 * @param {string} input
 * @param {any} evalResult
 * @param {boolean?} error
 * @return { Promise < import("discord.js").InteractionReplyOptions > }
 */

export async function evalResult(client, config: Config, input, evalResult, error=false) {
    
    let evalResultEmbed = new EmbedBuilder()
        .setTitle("Eval")
        .setColor(Util.resolveColor(config.getColors().ok))
        .setFooter({text: "Eval is Evil"})
        .addFields({name:"Input", value: trim(codeBlock("js",input), 1024)})
        .addFields({name:"Result", value: trim(codeBlock("js",evalResult||"Nothing was returned..."), 1024)});
    if (error){
        evalResultEmbed
         .setColor(Util.resolveColor(config.getColors().error))
         .setDescription("ERROR");
    }

    return { embeds: [evalResultEmbed] };
}
