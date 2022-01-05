import {CommandContext} from "@lib/mini-command";
import * as spaces from '@app/repositories/spaces'
import {MessageEmbed} from "discord.js";

export async function listSpaces(ctx: CommandContext) {
    let space_s = await spaces.findAll()

    return ctx.message.reply({
        embeds: [new MessageEmbed(
            {
                title: 'Spaces',
                description: space_s.map(s => `${s.name} - <@&${s.roleId}>`).join('\n')
            }
        )]
    })
}