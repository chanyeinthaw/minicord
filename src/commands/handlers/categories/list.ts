import {CommandContext} from "@lib/mini-command";
import {ChannelTypes} from "discord.js/typings/enums";
import {MessageEmbed, Permissions} from "discord.js";

export async function listCategories(ctx: CommandContext, space: any) {
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