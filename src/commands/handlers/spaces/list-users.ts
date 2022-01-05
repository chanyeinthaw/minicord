import {CommandContext} from "@lib/mini-command";
import * as spaces from '@app/repositories/spaces'
import {MessageEmbed} from "discord.js";

export async function listUsers(ctx: CommandContext) {
    let { spaceRoleId } = ctx.params
    let space = await spaces.find(spaceRoleId)

    return ctx.message.reply({
        embeds: [new MessageEmbed(
            {
                title: 'Users',
                description: space.users.map(s => `<@${s.user.id}> - ${s.user.isRoot ? 'root' : 'user'}`).join('\n')
            }
        )]
    })
}