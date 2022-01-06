import {CommandContext} from "@lib/mini-command";
import * as spaces from '@app/repositories/spaces'
import {MessageEmbed} from "discord.js";

export async function listCategories(ctx: CommandContext) {
    let {spaceRoleId} = ctx.params
    let space = await spaces.find(spaceRoleId, 'name')
    let categoryIds = space.categories.map(c => c.discordId)
    let categories = await ctx.guild?.channels.cache.filter(c => categoryIds.indexOf(c.id) > -1 && c.type === 'GUILD_CATEGORY')

    return ctx.message.reply({
        embeds: [
            new MessageEmbed({
                title: 'Categories',
                description: categories?.map(c => `${c.name} - ${c.id}`).join('\n')
            })
        ]
    })
}